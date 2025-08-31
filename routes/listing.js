// const express = require("express");
// const router= express.Router();
// const Listing = require("../models/listing.js");
// const wrapAsync =require("../utils/wrapAsync.js");
// const { models } = require("mongoose");

// router.get("/", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   });

//   //New Route
// router.get("/new", (req, res) => {
//     res.render("listings/new.ejs");
//   });
  
//   //Show Route
//   router.get("/:id", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs", { listing });
//   });
  
//   //Create Route
// //   router.post("/", async (req, res) => {
// //     console.log("HEY ",req.body)
// //     let newListing = await Listing.create({...req.body , image : { filename : `image-${new Date().getMilliseconds()}`,
// //     url : req.body.imageUrl}});
// //     console.log("New Listing ",newListing)
// //     // await newListing.save();
// //     res.redirect("/listings");
// //   });
// router.post("/", async (req, res) => {
//     console.log("Form Data:", req.body);

//     let imageUrl = req.body.listing.image || "default.jpg"; // fallback image

//     let newListing = await Listing.create({
//         ...req.body.listing,
//         image: {
//             filename: `image-${Date.now()}`,
//             url: imageUrl
//         }
//     });

//     console.log("New Listing Created:", newListing);
//     res.redirect("/listings");
// });

//   //Edit Route
//   router.get("/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
//   });
  
//   //Update Route
//   router.put("/:id", async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   });
  
//   //Delete Route
//  router.delete("/:id", async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
//   });

//   module.exports = router;