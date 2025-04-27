const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Listing } = require("../models/listing");
const Reservation = require("../models/reservation");
const AdminMessage = require("../models/adminMessage");
const Article = require("../models/article");
const Payment = require('../models/Payment');
const { Question } = require('../models/questions');

exports.getAllUsers = async (req, res) => {  
  try {
    const filters = req.query;
    const query = {};
    let sortOptions = {};
    if (filters.nameFilter) {
      query.firstName = { $regex: filters.nameFilter, $options: "i" };
    }
    if (filters.surrnameFilter) {
      query.lastName = { $regex: filters.surrnameFilter, $options: "i" };
    }
    if (filters.emailFilter) {
      query.email = { $regex: filters.emailFilter, $options: "i" };
    }
    if (filters.roleFilter) {
      query.role = filters.roleFilter;
    }
    if (filters.moneyFilter) {
      if (filters.moneyFilter === "Saldo(najwyższe)") {
        sortOptions.balance = -1;
      } else {
        sortOptions.balance = 1;
      }
    }
    const users = await User.find(query).select("-password").sort(sortOptions);

    res.send(users);
  } catch (error) {
    console.error("Błąd podczas pobierania użytkowników:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).send({ message: "Nie znaleziono użytkownika" });
    res.send(user);
  } catch (error) {
    console.error("Błąd podczas pobierania użytkownika:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedData = req.body;
    delete updatedData.password;

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    }).select("-password");
    if (!user)
      return res.status(404).send({ message: "Nie znaleziono użytkownika" });

    res.send(user);
  } catch (error) {
    console.error("Błąd podczas aktualizacji użytkownika:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).send({ message: "Nie znaleziono użytkownika" });
    res.send({ message: "Użytkownik został pomyślnie usunięty" });
  } catch (error) {
    console.error("Błąd podczas usuwania użytkownika:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const filters = req.query;
    const query = {};

    const pipeline = [{ $match: query }];

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "teacher",
        foreignField: "_id",
        as: "teacher",
      },
    });

    pipeline.push({ $unwind: "$teacher" });

    pipeline.push({ $match: { "teacher.role": "Nauczyciel" } });

    if (filters.teacherNameFilter) {
      const teacherRegex = new RegExp(filters.teacherNameFilter, "i");
      pipeline.push({
        $match: {
          $or: [
            { "teacher.firstName": { $regex: teacherRegex } },
            { "teacher.lastName": { $regex: teacherRegex } },
          ],
        },
      });
    }

    if (filters.titleFilter) {
      const titleRegex = new RegExp(filters.titleFilter, "i");
      pipeline.push({
        $match: {
          $or: [{ title: { $regex: titleRegex } }],
        },
      });
    }
    if (filters.subjectFilter) {
      const subjectRegex = new RegExp(filters.subjectFilter, "i");
      pipeline.push({
        $match: {
          $or: [{ subject: { $regex: subjectRegex } }],
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        subject: 1,
        description: 1,
        pricePerHour: 1,
        "teacher.firstName": 1,
        "teacher.lastName": 1,
        "teacher.email": 1,
      },
    });

    const listings = await Listing.aggregate(pipeline);
    res.send(listings);
  } catch (error) {
    console.error("Błąd podczas pobierania ogłoszeń:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "teacher",
      "firstName lastName email"
    );
    if (!listing)
      return res.status(404).send({ message: "Nie znaleziono ogłoszenia" });
    res.send(listing);
  } catch (error) {
    console.error("Błąd podczas pobierania ogłoszenia:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedListing)
      return res.status(404).send({ message: "Nie znaleziono ogłoszenia" });
    res.send(updatedListing);
  } catch (error) {
    console.error("Błąd podczas aktualizacji ogłoszenia:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing)
      return res.status(404).send({ message: "Nie znaleziono ogłoszenia" });
    res.send({ message: "Ogłoszenie zostało pomyślnie usunięte" });
  } catch (error) {
    console.error("Błąd podczas usuwania ogłoszenia:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await AdminMessage.find().sort({ createdAt: -1 });
    res.send(messages);
  } catch (error) {
    console.error("Błąd podczas pobierania wiadomości:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await AdminMessage.findById(req.params.id);
    if (!message)
      return res.status(404).send({ message: "Nie znaleziono wiadomości" });
    res.send(message);
  } catch (error) {
    console.error("Błąd podczas pobierania wiadomości:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await AdminMessage.findByIdAndDelete(req.params.id);
    if (!message)
      return res.status(404).send({ message: "Nie znaleziono wiadomości" });
    res.send({ message: "Wiadomość została pomyślnie usunięta" });
  } catch (error) {
    console.error("Błąd podczas usuwania wiadomości:", error);
    res.status(500).send({ message: "Błąd serwera" });
  }
};

exports.getAllOpinions = async (req, res) => {
  try {
    const { rating, startDate, endDate, firstName, lastName } = req.query;
    const listingsWithReviews = await Listing.find({
      "reviews.0": { $exists: true },
    })
      .select("reviews title teacher")
      .populate("teacher", "firstName lastName email")
      .populate("reviews.student", "firstName lastName email")
      .lean();

    let allReviews = [];

    listingsWithReviews.forEach((listing) => {
      const { _id: listingId, title: listingTitle, teacher, reviews } = listing;

      reviews.forEach((review) => {
        if (rating && review.rating !== parseInt(rating)) return;

        const reviewDate = new Date(review.createdAt);
        if (startDate && reviewDate < new Date(startDate)) return;
        if (endDate && reviewDate > new Date(endDate)) return;

        const studentFirstName = review.student.firstName.toLowerCase();
        const studentLastName = review.student.lastName.toLowerCase();
        if (firstName && !studentFirstName.includes(firstName.toLowerCase()))
          return;
        if (lastName && !studentLastName.includes(lastName.toLowerCase()))
          return;

        allReviews.push({
          reviewId: review._id,
          comment: review.comment,
          rating: review.rating,
          createdAt: review.createdAt,
          student: review.student,
          teacher: teacher,
          listingId: listingId,
          listingTitle: listingTitle,
        });
      });
    });

    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(allReviews);
  } catch (error) {
    console.error("Błąd podczas pobierania opinii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.editOpinion = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowy identyfikator opinii" });
    }

    const listing = await Listing.findOne({ "reviews._id": reviewId });
    if (!listing) {
      return res.status(404).json({ message: "Opinia nie znaleziona" });
    }

    const review = listing.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Opinia nie znaleziona" });
    }

    if (comment) review.comment = comment;
    if (rating) review.rating = rating;
    review.updatedAt = Date.now();

    if (listing.reviews.length > 0) {
      listing.rating =
        listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
        listing.reviews.length;
    } else {
      listing.rating = 0;
    }

    await listing.save();
    res.json({ message: "Opinia została zaktualizowana", review });
  } catch (error) {
    console.error("Błąd podczas edycji opinii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.deleteOpinion = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowy identyfikator opinii" });
    }

    const listing = await Listing.findOne({ "reviews._id": reviewId });
    if (!listing) {
      return res.status(404).json({ message: "Opinia nie znaleziona" });
    }

    const review = listing.reviews.id(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ message: "Opinia nie znaleziona w ogłoszeniu" });
    }

    listing.reviews.pull(reviewId);

    if (listing.reviews.length > 0) {
      listing.rating =
        listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
        listing.reviews.length;
    } else {
      listing.rating = 0;
    }

    await listing.save();
    res.json({ message: "Opinia została usunięta" });
  } catch (error) {
    console.error("Błąd podczas usuwania opinii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getListingsPerTutor = async (req, res) => {
  try {
    const listingsPerTutor = await Listing.aggregate([
      {
        $group: {
          _id: "$teacher",
          listingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $unwind: "$teacher",
      },
      {
        $project: {
          _id: 0,
          teacherId: "$teacher._id",
          teacherName: {
            $concat: ["$teacher.firstName", " ", "$teacher.lastName"],
          },
          listingCount: 1,
        },
      },
    ]);

    res.json(listingsPerTutor);
  } catch (error) {
    console.error(
      "Błąd podczas pobierania liczby ofert per korepetytor:",
      error
    );
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getTotalListings = async (req, res) => {
  try {
    const { month, year } = req.query;

    const match = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      match.createdAt = { $gte: startDate, $lt: endDate };
    }

    const listingsPerMonth = await Listing.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const totalListings = await Listing.countDocuments();

    res.json({ listingsPerMonth, totalListings });
  } catch (error) {
    console.error("Błąd podczas pobierania łącznej liczby ofert:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getTopTutors = async (req, res) => {
  try {
    const topTutors = await Reservation.aggregate([
      {
        $group: {
          _id: "$listingId",
          reservationCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "_id",
          as: "listing",
        },
      },
      {
        $unwind: "$listing",
      },
      {
        $group: {
          _id: "$listing.teacher",
          totalReservations: { $sum: "$reservationCount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "tutor",
        },
      },
      {
        $unwind: "$tutor",
      },
      {
        $project: {
          _id: 0,
          tutorId: "$tutor._id",
          tutorName: {
            $concat: ["$tutor.firstName", " ", "$tutor.lastName"],
          },
          totalReservations: 1,
        },
      },
      {
        $sort: { totalReservations: -1 },
      },
      { $limit: 5 },
    ]);

    res.json(topTutors);
  } catch (error) {
    console.error("Błąd podczas pobierania top korepetytorów:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getTopListings = async (req, res) => {
  try {
    const topListings = await Reservation.aggregate([
      {
        $lookup: {
          from: "listings",
          localField: "listingId",
          foreignField: "_id",
          as: "listing",
        },
      },
      {
        $unwind: "$listing",
      },
      {
        $group: {
          _id: "$listing._id",
          listingTitle: { $first: "$listing.title" },
          reservationCount: { $sum: 1 },
          subject: { $first: "$listing.subject" },
        },
      },
      {
        $sort: { reservationCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json(topListings);
  } catch (error) {
    console.error("Błąd podczas pobierania top ofert:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const [
      listingsPerTutor,
      totalListingsCount,
      topTutors,
      topListings,
      listingsPerMonth,
      promotedListingsPerMonth,
      totalPromotionsCount,
      listingsPerTutorOverTime,
      reservationsPerMonth,
      totalReservationsCount,
    ] = await Promise.all([
      Listing.aggregate([
        {
          $group: {
            _id: "$teacher",
            listingCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "teacher",
          },
        },
        {
          $unwind: "$teacher",
        },
        {
          $project: {
            _id: 0,
            teacherId: "$teacher._id",
            teacherName: {
              $concat: ["$teacher.firstName", " ", "$teacher.lastName"],
            },
            listingCount: 1,
          },
        },
        {
          $sort: { listingCount: -1 },
        },
      ]),

      Listing.countDocuments(),

      Reservation.aggregate([
        {
          $group: {
            _id: "$listingId",
            reservationCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "listings",
            localField: "_id",
            foreignField: "_id",
            as: "listing",
          },
        },
        {
          $unwind: "$listing",
        },
        {
          $group: {
            _id: "$listing.teacher",
            totalReservations: { $sum: "$reservationCount" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "tutor",
          },
        },
        {
          $unwind: "$tutor",
        },
        {
          $project: {
            _id: 0,
            tutorId: "$tutor._id",
            tutorName: {
              $concat: ["$tutor.firstName", " ", "$tutor.lastName"],
            },
            totalReservations: 1,
          },
        },
        {
          $sort: { totalReservations: -1 },
        },
        { $limit: 5 },
      ]),

      Reservation.aggregate([
        {
          $lookup: {
            from: "listings",
            localField: "listingId",
            foreignField: "_id",
            as: "listing",
          },
        },
        {
          $unwind: "$listing",
        },
        {
          $group: {
            _id: "$listing._id",
            listingTitle: { $first: "$listing.title" },
            reservationCount: { $sum: 1 },
            subject: { $first: "$listing.subject" },
          },
        },
        {
          $sort: { reservationCount: -1 },
        },
        {
          $limit: 5,
        },
      ]),

      Listing.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]),

      Listing.aggregate([
        {
          $match: {
            isPromoted: true,
          },
        },
        {
          $project: {
            promotionStartDate: {
              $subtract: [
                "$promotionEndDate",
                1000 * 60 * 60 * 24 * 30, 
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$promotionStartDate" },
              year: { $year: "$promotionStartDate" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]),

      Listing.countDocuments({ isPromoted: true }),

      (async () => {
        const topTutorsByListings = await Listing.aggregate([
          {
            $group: {
              _id: "$teacher",
              listingCount: { $sum: 1 },
            },
          },
          {
            $sort: { listingCount: -1 },
          },
          { $limit: 10 },
          {
            $project: {
              _id: 1,
            },
          },
        ]);

        const topTutorIds = topTutorsByListings.map((doc) => doc._id);

        return await Listing.aggregate([
          {
            $match: {
              teacher: { $in: topTutorIds },
            },
          },
          {
            $group: {
              _id: {
                tutorId: "$teacher",
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              listingCount: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id.tutorId",
              foreignField: "_id",
              as: "tutor",
            },
          },
          {
            $unwind: "$tutor",
          },
          {
            $project: {
              _id: 0,
              tutorId: "$tutor._id",
              tutorName: {
                $concat: ["$tutor.firstName", " ", "$tutor.lastName"],
              },
              month: "$_id.month",
              year: "$_id.year",
              listingCount: 1,
            },
          },
          {
            $sort: {
              tutorName: 1,
              year: 1,
              month: 1,
            },
          },
        ]);
      })(),

      Reservation.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]),

      Reservation.countDocuments(),
    ]);

    res.json({
      listingsPerTutor,
      totalListingsCount,
      topTutors,
      topListings,
      listingsPerMonth,
      promotedListingsPerMonth,
      totalPromotionsCount,
      listingsPerTutorOverTime,
      reservationsPerMonth,
      totalReservationsCount,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania statystyk:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = "/uploads/articles/" + req.file.filename;
    }

    const newArticle = new Article({
      title,
      excerpt,
      content,
      imageUrl,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Błąd podczas tworzenia artykułu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error("Błąd podczas pobierania artykułów:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Artykuł nie znaleziony" });
    res.json(article);
  } catch (error) {
    console.error("Błąd podczas pobierania artykułu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = "/uploads/articles/" + req.file.filename;
    }

    const article = await Article.findById(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Artykuł nie znaleziony" });

    article.title = title;
    article.excerpt = excerpt;
    article.content = content;
    article.imageUrl = imageUrl;

    await article.save();
    res.json(article);
  } catch (error) {
    console.error("Błąd podczas aktualizacji artykułu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Artykuł nie znaleziony" });
    res.json({ message: "Artykuł został usunięty" });
  } catch (error) {
    console.error("Błąd podczas usuwania artykułu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getLatestArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(3);
    res.json(articles);
  } catch (error) {
    console.error("Błąd podczas pobierania najnowszych artykułów:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.send(payments);
  } catch (error) {
    console.error('Błąd podczas pobierania płatności:', error);
    res.status(500).send({ message: 'Błąd serwera' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const payment = await Payment.findById(id).populate('user');

    if (!payment) {
      return res.status(404).send({ message: 'Prośba nie znaleziona' });
    }

    if (status === 'Zatwierdzony') {
      if (payment.amount > payment.user.balance) {
        return res.status(400).send({
          message: 'Użytkownik nie ma wystarczających środków',
        });
      }

      payment.user.balance -= payment.amount;
      await payment.user.save();
    }

    payment.status = status;
    await payment.save();

    res.send({ message: 'Status prośby został zaktualizowany' });
  } catch (error) {
    console.error('Błąd podczas aktualizacji prośby:', error);
    res.status(500).send({ message: 'Błąd serwera' });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('student', 'firstName lastName email');
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Błąd podczas pobierania pytań:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('student', 'firstName lastName email');
    if (!question) {
      return res.status(404).json({ message: 'Nie znaleziono pytania' });
    }
    res.status(200).json({ question });
  } catch (error) {
    console.error('Błąd podczas pobierania pytania:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Nie znaleziono pytania' });
    }
    res.status(200).json({ message: 'Pytanie zostało usunięte' });
  } catch (error) {
    console.error('Błąd podczas usuwania pytania:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};
