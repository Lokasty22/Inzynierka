exports.getProfile = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password');
        if(!user) return res.status(404).send('Użytkownik nie znaleziony');
        res.send(user);
    }
    catch(error){
        console.error('Error fetching user:', error);
        res.status(500).send('Błąd serwera');
    }
}