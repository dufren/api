const Payment = require("../models/Payment");
const asyncHandler = require("express-async-handler");

const getAllPayments = asyncHandler(async (req, res) => {
  const payment = await Payment.find().lean();

  if (!payment?.length) {
    return res.status(400).json({ message: "No payment found" });
  }

  res.json(payment);
});

const createNewPayment = asyncHandler(async (req, res) => {
  const { name, cardNumber, expirationDate, cvv } = req.body;

  if (!name || !cardNumber || !expirationDate || !cvv) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const payment = await Payment.create({
    name,
    cardNumber,
    expirationDate,
    cvv,
  });

  if (payment) {
    return res.status(201).json({ message: "New payment created" });
  } else {
    return res.status(400).json({ message: "Invalid payment data received" });
  }
});

const deletePayment = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Payment ID required" });
  }

  const payment = await Payment.findById(id).exec();

  if (!payment) {
    return res.status(400).json({ message: "Payment not found" });
  }

  const result = await payment.deleteOne();

  const reply = `Payment '${result.cardNumber}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllPayments,
  createNewPayment,
  deletePayment,
};
