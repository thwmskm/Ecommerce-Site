const Payment = () => (
  <div>
    <h3>Payment Information</h3>
    <label>
      Card Number: <input type="text" name="cardNum" />
    </label>
    <label>
      Name on Card: <input type="text" name="cardName" />
    </label>
    <label>
      Expiry Date: <input type="text" name="cardExp" />
    </label>
    <label>
      CVV: <input type="text" name="cvv" />
    </label>
  </div>
);

export default Payment;
