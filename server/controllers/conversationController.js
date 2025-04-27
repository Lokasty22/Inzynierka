const Conversation = require("../models/conversation");

//Pobranie  wszystkich kowersacji dla zalogowanego użytkownika
exports.getConversationsForUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const conversations = await Conversation.find({
      participants: userId,
      deletedBy: { $not: { $elemMatch: { userId: userId, isDeleted: true } } },
    }).populate("participants", "firstName lastName email");

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Błąd podczas pobierania konwersacji:", error);
    res
      .status(500)
      .json({ error: "Błąd podczas pobierania listy konwersacji." });
  }
};

exports.getConversationDetails = async (req, res) => {
  const conversationId = req.params.id;

  try {
      const conversation = await Conversation.findById(conversationId)
          .populate('participants', 'firstName lastName email') // Pobieramy informacje o uczestnikach
          .populate('messages.sender', 'firstName lastName')    // Pobieramy informacje o nadawcy wiadomości
          .populate('messages.receiver', 'firstName lastName'); // Pobieramy informacje o odbiorcy wiadomości

      if (!conversation) {
          return res.status(404).json({ error: 'Konwersacja nie została znaleziona.' });
      }

      res.status(200).json(conversation);
  } catch (error) {
      console.error('Błąd podczas pobierania szczegółów konwersacji:', error);
      res.status(500).json({ error: 'Błąd serwera.' });
  }
};


exports.sendMessage = async (req, res) => {
  const { receiverId, title, content } = req.body;
  const senderId = `${req.user._id}`;

  console.log("Request Body:", req.body);
  console.log("Sender ID:", senderId);

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (conversation) {
      if (conversation.deletedBy) {
        // Zmieniamy wszystkie wartości isDeleted na false
        conversation.deletedBy = conversation.deletedBy.map((entry) => {
          return { ...entry, isDeleted: false };
        });
      }
    } else {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = {
      sender: senderId,
      receiver: receiverId,
      content: content,
      date: new Date(),
    };

    conversation.messages.push(newMessage);
    await conversation.save();

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Błąd podczas wysyłania wiadomości:", error);
    res.status(500).json({ error: "Błąd podczas wysyłania wiadomości." });
  }
};

//Usuwanie konwersacji przez któregoś z dwóch uczestników
exports.deleteConversation = async (req, res) => {
  const userId = req.user._id; // ID zalogowanego użytkownika
  const { id: conversationId } = req.params; // ID konwersacji

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res
        .status(404)
        .json({ error: "Konwersacja nie została znaleziona." });
    }

    // Sprawdź, czy użytkownik jest uczestnikiem konwersacji
    if (!conversation.participants.includes(userId)) {
      return res
        .status(403)
        .json({ error: "Nie masz dostępu do tej konwersacji." });
    }

    // Znajdź wpis w tablicy `deletedBy` dla danego użytkownika
    const existingEntry = conversation.deletedBy.find(
      (entry) => entry.userId.toString() === userId.toString(),
    );

    if (existingEntry) {
      // Zmień wartość pola `isDeleted` na true
      console.log("zmieniam na true");
      existingEntry.isDeleted = true;
    } else {
      // Jeśli użytkownik nie istnieje w `deletedBy`, dodaj nowy wpis
      console.log("robię nowy wpis?");
      conversation.deletedBy.push({ userId, isDeleted: true });
    }

    // Zapisz zmiany w bazie danych
    await conversation.save();

    res.status(200).json({ message: "Konwersacja została usunięta z widoku." });
  } catch (error) {
    console.error("Błąd podczas usuwania konwersacji:", error);
    res.status(500).json({ error: "Błąd podczas usuwania konwersacji." });
  }
};

