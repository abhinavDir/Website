const Listing = require("./models/listing");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'you must be logged in to create');
      return res.redirect("/user/login")
    
    }
    next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
  if(req.session.redirectUrl){
    req.locals.redirectUrl=req.session.redirectUrl;

  }
  next();
}

module.exports.isOwner= async(req,res,next)=>{
  let {id} =req.params;
  let listing =await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you dont have permission");
    return res.redirect(`/listings ${id}`);
  }
}