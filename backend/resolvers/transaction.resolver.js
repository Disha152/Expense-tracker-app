import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        console.log("Context User:", context.getUser ? context.getUser() : "No context function");

        const user = context.getUser();
        if (!user) throw new Error("Unauthorized");

        console.log("User ID:", user._id);

        const transactions = await Transaction.find({ userId: user._id });
        return transactions;
      } catch (err) {
        console.error("Error getting transactions:", err);
        throw new Error("Error getting transactions");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) throw new Error("Transaction not found");
        return transaction;
      } catch (err) {
        console.error("Error getting transaction:", err);
        throw new Error("Error getting transaction");
      }
    },

    categoryStatistics: async (_, __, context) => {
      try {
        const user = context.getUser();
        if (!user) throw new Error("Unauthorized");

        const transactions = await Transaction.find({ userId: user._id });
        const categoryMap = {};

        transactions.forEach((transaction) => {
          if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0;
          }
          categoryMap[transaction.category] += transaction.amount;
        });

        return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
      } catch (err) {
        console.error("Error getting category statistics:", err);
        throw new Error("Error getting category statistics");
      }
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const user = context.getUser();
        if (!user) throw new Error("Unauthorized");

        const newTransaction = new Transaction({
          ...input,
          userId: user._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating transaction:", err);
        throw new Error("Error creating transaction");
      }
    },

    updateTransaction: async (_, { input }, context) => {
      try {
        const user = context.getUser();
        if (!user) throw new Error("Unauthorized");

        const updatedTransaction = await Transaction.findOneAndUpdate(
          { _id: input.transactionId, userId: user._id },
          input,
          { new: true }
        );

        if (!updatedTransaction) throw new Error("Transaction not found or unauthorized");
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating transaction:", err);
        throw new Error("Error updating transaction");
      }
    },

    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const user = context.getUser();
        if (!user) throw new Error("Unauthorized");

        const deletedTransaction = await Transaction.findOneAndDelete({
          _id: transactionId,
          userId: user._id,
        });

        if (!deletedTransaction) throw new Error("Transaction not found or unauthorized");
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error("Error deleting transaction");
      }
    },
  },

  Transaction: {
    user: async (parent) => {
      try {
        const user = await User.findById(parent.userId);
        return user;
      } catch (err) {
        console.error("Error getting user:", err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;
