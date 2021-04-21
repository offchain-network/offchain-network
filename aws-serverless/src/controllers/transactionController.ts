import { RequestHandler } from "express";

const transactionController = (dependencies: any) => {
  const createTransaction: RequestHandler = (req, res, next) => {
    res.status(404).json({ message: "Not implemented yet." });
  };

  const deleteTransaction: RequestHandler = (req, res, next) => {
    res.status(404).json({ message: "Not implemented yet." });
  };

  const listTransactionsBySender: RequestHandler = (req, res, next) => {
    res.status(404).json({ message: "Not implemented yet." });
  };

  const listTransactionsByReceiver: RequestHandler = (req, res, next) => {
    res.status(404).json({ message: "Not implemented yet." });
  };

  const listTransactionsByChannel: RequestHandler = (req, res, next) => {
    res.status(404).json({ message: "Not implemented yet." });
  };

  const listTransactions: RequestHandler = (req, res, next) => {
    res.status(404).json({ message: "Not implemented yet." });
  };

  return {
    createTransaction,
    deleteTransaction,
    listTransactionsBySender,
    listTransactionsByReceiver,
    listTransactionsByChannel,
    listTransactions,
  };
};

export default transactionController;
