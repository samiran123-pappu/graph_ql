import Transaction from "../models/transaction.model.js";

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
        }
        // TODO => add categoryStatistics query

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
    // TODO => add transaction/user relationship resolver
}

export default transactionResolver;