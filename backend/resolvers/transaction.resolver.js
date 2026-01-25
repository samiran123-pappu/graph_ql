import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
    Query:{
        transactions: async(_, __, context) => {
            try {
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = await context.getUser()._id;

                const transactions = await Transaction.find({userId});
                return transactions;
            } catch (error) {
                throw new Error(error.message);
                console.error("Error fetching transactions:", error);
                
            }
        },

        transaction: async(_, {transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (error) {
                throw new Error(error.message);
                console.error("Error fetching transaction:", error);
              
                
            }
        },

        categoryStatistics: async(_, __, context) => {
            const userId = context.getUser()._id;
            const transactions = await Transaction.find({userId});
            const categoryMap={};


            // const transactions = [
			// 	{ category: "expense", amount: 50 },
			// 	{ category: "expense", amount: 75 },
			// 	{ category: "investment", amount: 100 },
			// 	{ category: "saving", amount: 30 },
			// 	{ category: "saving", amount: 20 }
			// ];


            transactions.forEach((transaction) => {
                if(!categoryMap[transaction.category]){
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount;
            })
            
			// categoryMap = { expense: 125, investment: 100, saving: 50 }
            return Object.entries(categoryMap).map(([category, amount])=>({category, amount: amount})); //convert obj to array
            	// return [ { category: "expense", amount: 125 }, { category: "investment", amount: 100 }, { category: "saving", amount: 50 } ]

        }

    },
    Mutation:{
        createTransaction: async(_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })
                await newTransaction.save();
                return newTransaction;
                
            } catch (error) {
                throw new Error(error.message);
                console.error("Error creating transaction:", error);
                
            }
        },
        updateTransaction: async(_, {input}) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});
                return updatedTransaction;
                
            } catch (error) {
                throw new Error(error.message);
                console.error("Error updating transaction:", error);
                
            }
        },
        deleteTransaction: async(_, {transactionId}) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (error) {
                throw new Error(error.message);
                console.error("Error deleting transaction:", error);
            }
        }
    },
    Transaction: {
        user: async (parent) => {
            const userId = parent.userId;
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.error("Error fetching user for transaction:", error);
                throw new Error("Error fetching user for transaction");
            }

        }
    }
}

export default transactionResolver;