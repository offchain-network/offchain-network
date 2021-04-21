import { RequestHandler } from "express";
import { IDependencies } from "../types/types";

const transactionController = (dependencies: IDependencies) => {
  const { TransactionRepository } = dependencies;

  const createTransaction: RequestHandler = async (req, res, next) => {
    const { Transaction } = req.body;
    if (!Transaction) {
      return res.status(400).json({ message: "Transaction required" });
    }

    try {
      await TransactionRepository.create(Transaction);
      res.status(200).json({ message: "Transaction created." });
    } catch (err) {
      next(err);
    }
  };

  const deleteTransaction: RequestHandler = async (req, res, next) => {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ message: "TransactionId required." });
    }

    try {
      await TransactionRepository.delete(transactionId);
      res.status(200).json({ message: "Transaction deleted." });
    } catch (err) {
      next(err);
    }
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

  const listTransactions: RequestHandler = async (req, res, next) => {
    try {
      const Transactions = await TransactionRepository.list();
      res.status(200).json({ Transactions });
    } catch (err) {
      next(err);
    }
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
