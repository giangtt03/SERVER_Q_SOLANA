
module.exports = {
  getAllnfts: (req, res) => {
    const user = req.session.user;
    console.log("User:", user);
    res.render('blockchain/getAllnfts', { user });
  },
  mintNfts: (req, res) => {
    const user = req.session.user;
    console.log("User:", user);
    res.render('blockchain/nft', { user });
  }
};
