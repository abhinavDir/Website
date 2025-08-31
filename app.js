const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonder";
const Review = require("./models/review.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const { isLoggedIn, saveRedirectUrl,isOwner } = require("./middleware.js");

const app = express();

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Middleware for flash messages
app.use((req, res, next) => {
  res.locals.user = req.user; // User info, if logged in

  res.locals.currUser = req.user;
  next();
});

// Set up views, static files, and parsing middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware setup
app.use(session({
  secret: "thisisnotagoodsecret",
  resave: false,
  saveUninitialized: false
}));

// Flash middleware should come after session setup
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes

// Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New Route
app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
 console.log(listing)
  res.render("listings/show.ejs", { listing });
});

// Create Route
// app.post("/listings", isLoggedIn, async (req, res) => {
//   const newListing = await Listing.create({
//     ...req.body,
//     image: 
//     { filename: `image-${new Date().getMilliseconds()}`, url: req.body.image }
//     newListing.owner =req.user._id;
//     await newListing.save();
//     res.redirect("/listings");
//   });
// });
app.post("/listings", isLoggedIn, async (req, res) => {
  const newListing = await Listing.create({
    ...req.body,
    image: {
      filename: `image-${new Date().getMilliseconds()}`,
      url: req.body.image
    }
  });
  newListing.owner = req.user._id;
  await newListing.save();
  res.redirect("/listings");
});


// Edit Route
app.get("/listings/:id/edit", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit.ejs", { listing });
});

// Update Route
app.put("/listings/:id", isLoggedIn, isOwner, async(req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
  res.redirect(`/listings/${req.params.id}`);
});

// Delete Route
app.delete("/listings/:id", isLoggedIn, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
});

// Review Route
app.post("/listings/review/:id",isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = await Review.create(req.body.reviews);
  listing.reviews.push(newReview._id); // Add review to listing
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});


// User Signup Routes
app.get("/user/signup", (req, res) => {
  res.render("user/signup");
});

app.post("/user/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ email, username });
  
  try {
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome, your account has been created!');
      res.redirect("/listings");
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error signing up. Please try again!');
    res.redirect("/user/signup");
  }
});

// User Login Routes
app.get("/user/login", (req, res) => {
  res.render("user/login");
});

app.post("/user/login",
  saveRedirectUrl,
  passport.authenticate("local", { 
    failureRedirect: "/user/login",
     failureFlash: true }),
  (req, res) => {
    
    req.flash("success", "Welcome back!");
     const redirectUrl = res.locals.redirectUrl || "/listings"; // Default to "/listings" if no redirectUrl
    res.redirect(redirectUrl);
    // res.redirect( req.locals.redirectUrl);
  }
);

// Logout Route
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
});




// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
