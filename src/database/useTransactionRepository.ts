import { useSQLiteContext } from "expo-sqlite/next";

type TransactionCreateDatabaseProps = {
  amount: number;
  goalId: number;
};

type TransactionResponseDatabaseProps = {
  id: string;
  amount: number;
  goal_id: number;
  created_at: number;
};

export function useTransactionRepository() {
  const database = useSQLiteContext();

  function findLatest() {
    try {
      return database.getAllSync<TransactionResponseDatabaseProps>(
        "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10"
      );
    } catch (error) {
      throw error;
    }
  }

  function findByGoal(goalId: number) {
    try {
      const statement = database.prepareSync(
        "SELECT * FROM transactions WHERE goal_id = $goal_id"
      );

      const result = statement.executeSync<TransactionResponseDatabaseProps>({
        $goal_id: goalId,
      });

      return result.getAllSync();
    } catch (error) {
      throw error;
    }
  }

  function create(transaction: TransactionCreateDatabaseProps) {
    try {
      const statement = database.prepareSync(
        "INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goal_id)"
      );

      statement.executeSync({
        $amount: transaction.amount,
        $goal_id: transaction.goalId,
      });
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    findByGoal,
    findLatest,
  };
}
