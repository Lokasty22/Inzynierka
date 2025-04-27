import React, { useEffect, useState } from "react";
import RedeemGiftcard from "../components/RedeemGiftcard";
import BalanceCard from "../components/BalanceCard";
import axios from "axios";

const BalancePage = () => {
    const [balance, setBalance] = useState(null);
  const fetchUserData = async () => {
    try {
      const res = await axios.get(`/api/users/me`);
      const {balance} = res.data;
      setBalance(balance);
    } catch (error) {
      console.error("Wystąpił błąd z fetchowaniem danych użytkownika.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [balance]);


  return (
    <BalanceCard balance={balance} />
    // <RedeemGiftcard/>
  );
};

export default BalancePage;
