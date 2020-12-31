require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://TheDumebi:" + process.env.DB_PASSWORD +"@cluster0.zrvvc.mongodb.net/100daysDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
// mongoose.connect("mongodb://localhost:27017/100daysDB", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

const articleSchema = mongoose.Schema ({
  title: String,
  content: {
    type: String,
    required: [true, "Content cannot be empty"]
  }
});

const Article = mongoose.model("Article", articleSchema);

const userSchema = new mongoose.Schema ({
  username: String,
  password: String,
  articles: [articleSchema]
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get("/", function(req, res) {
  User.find({"articles": {$elemMatch: {$exists: true}}},{"articles":{"$slice": -1}}, function(err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers.length === 0) {
        res.render("home", {latestArticle: null});
      } else {
        const latestArticle = foundUsers[0].articles[0];
        res.render("home", {latestArticle: latestArticle});
      }
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/articles", function(req, res) {
  User.find({"articles": {$elemMatch: {$exists: true}}}, function(err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("articles", {usersWithArticles: foundUsers});
      }
    }
  });
});

app.get("/articles/:articleId", function(req, res) {
  const articleId = req.params.articleId;
  User.findOne({"articles": {$elemMatch: {"_id": articleId}}}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      const article = foundUser.articles.filter((article) => {
        return (article._id == articleId);
      });
      res.render("article", {article: article, user: req.user});
      // console.log(foundUser);
    }
  });
});

app.route("/articles/:articleId/edit")
.get(function(req, res) {
  const articleId = req.params.articleId;
  if (req.isAuthenticated()) {
    User.findOne({"articles": {$elemMatch: {"_id": articleId}}}, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        const article = foundUser.articles.filter((article) => {
          return (article._id == articleId);
        });
        res.render("edit", {article: article});
        // console.log(foundUser);
      }
    });
  } else {
    res.redirect("/articles/" + articleId );
  }
})
.post(function(req, res) {
  const articleId = req.params.articleId;
  if (req.isAuthenticated()) {
    User.findByIdAndUpdate(req.user.id, {$set: {"articles.$[el]": req.body}}, {arrayFilters: [{"el._id": articleId}], new: true}, function(err, foundUser) {
      if (err) {
        res.redirect("/articles/" + articleId + "/edit");
      } else {
        res.redirect("/articles");
      }
    });
  } else {
    res.redirect("/articles/" + articleId );
  }


});

app.post("/delete", function(req, res) {
  const articleId = req.body.delete;
  if (req.isAuthenticated()) {
    User.findByIdAndUpdate(req.user.id, {$pull: {articles: {_id: articleId}}}, function(err, foundUser) {
      if (err) {
        res.redirect("/articles/" + articleId );
        console.log("error");
      } else {
        res.redirect("/articles");
      }
    });
  } else {
    res.redirect("/articles/" + articleId );
  }
});

app.route("/compose")
.get(function(req, res) {
  if (req.isAuthenticated()) {
    res.render("compose");
  } else {
    res.redirect("/login");
  }
})
.post(function(req, res) {
  if (req.isAuthenticated()) {
    const article = new Article ({
      title: req.body.articleTitle,
      content: req.body.articleContent
    });
    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          foundUser.articles.push(article);
          foundUser.save(() => res.redirect("/articles"));
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.route("/register")
.get(function(req, res) {
  res.render("register");
})
.post(function(req, res) {
  User.register({username: req.body.username}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local", {failureRedirect: "/register"})(req, res, function() {
        res.redirect("/articles");
      });
    }
  });
});

app.route("/login")
.get(function(req, res) {
  res.render("login");
})
.post(function(req, res) {
  const user = new User ({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local", {failureRedirect: "/login"})(req, res, function() {
        res.redirect("/compose");
      });
    }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/articles");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server successfully started on " + port);
});
