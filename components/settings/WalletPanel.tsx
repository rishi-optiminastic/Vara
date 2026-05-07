import type { Wallet, WalletTransaction } from "@prisma/client"
import { WalletBalanceCard } from "@/components/wallet/WalletBalanceCard"
import { TransactionsTable } from "@/components/wallet/TransactionsTable"

interface Props {
  wallet: Wallet
  transactions: WalletTransaction[]
  depositAddress: string | null
}

export function WalletPanel({ wallet, transactions, depositAddress }: Props): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <WalletBalanceCard wallet={wallet} depositAddress={depositAddress} />
      <TransactionsTable transactions={transactions} />
    </div>
  )
}
