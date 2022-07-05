import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export const PaymentsUpdatePage = () => {
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [id, setId] = useState('');

  const [payment, setPayment] = useState({});

  const [cardPayment, setCardPayment] = useState(false);

  const [name, setName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const id = params.get('id');
    setId(id);
  }, [apiUrl]);

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiUrl}/payment`)
        .then((response) => {
          console.log(response.data);
          let payment = response.data.find((x) => x.PaymentId === parseInt(id));
          setPayment(payment);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, apiUrl]);

  useEffect(() => {
    if (payment) {
      setName(payment.CustomerName);
      setPaymentMethod(payment.PaymentMethod);
      setAddress(payment.Address);
      setCardNumber(payment.CardNumber);
      setItemPrice(payment.TotalAmount);
      setOrderId(payment.OrderId);
    }
  }, [payment]);

  useEffect(() => {
    paymentMethod === 'card' ? setCardPayment(true) : setCardPayment(false);
  }, [paymentMethod]);

  const handlePaymentOptions = (e) => {
    setPaymentMethod(e.target.value);

    if (e.target.value === 'card') {
      setCardPayment(true);
    } else {
      setCardNumber('');
      setCardPayment(false);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    let paymentForm = document.getElementById('paymentForm');
    let isFormValid = paymentForm.checkValidity();
    paymentForm.reportValidity();

    if (isFormValid) {
      let payment = {
        PaymentId: id,
        CustomerName: name,
        PaymentDate: new Date().toISOString(),
        PaymentMethod: paymentMethod,
        Address: address,
        CardNumber: cardNumber,
        TotalAmount: itemPrice,
        OrderId: orderId,
      };

      axios
        .put(`${apiUrl}/payment`, payment)
        .then((response) => {
          console.log(response);
          history.push('/payments');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="container">
      <form className="row g-3" id="paymentForm">
        <div className="col-md-6">
          <label htmlFor="username" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required></input>
        </div>
        <div className="col-md-6">
          <label htmlFor="payment-method" className="form-label">
            Payment Method
          </label>
          <select
            id="payment-method"
            className="form-select"
            onChange={(e) => handlePaymentOptions(e)}
            value={paymentMethod}>
            <option defaultValue>Choose...</option>
            <option value="card">VISA / Mastercard</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="inputAddress" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            required></input>
        </div>
        <div className="col-12">
          <label htmlFor="inputCard" className="form-label">
            Card Number
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCard"
            onChange={(e) => setCardNumber(e.target.value)}
            value={cardNumber}
            disabled={!cardPayment}></input>
        </div>
        <div className="col-6">Total Price:</div>
        <div className="col-6">
          <strong>Rs. {parseFloat(itemPrice).toFixed(2)}</strong>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => handlePay(e)}>
            Update Payment
          </button>
        </div>
      </form>
    </div>
  );
};
