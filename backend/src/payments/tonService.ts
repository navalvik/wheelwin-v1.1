import TonWeb from "tonweb"

const TON_RPC = "https://toncenter.com/api/v2/jsonRPC"

export interface TonPayment {
  hash: string
  from: string
  to: string
  amount: number
  comment?: string
}

export class TonService {

  private tonweb: TonWeb
  private walletAddress: string

  constructor(walletAddress: string) {

    const provider = new TonWeb.HttpProvider(TON_RPC)

    this.tonweb = new TonWeb(provider)

    this.walletAddress = walletAddress

  }

  /*
  CREATE DEPOSIT ADDRESS
  */

  getDepositAddress(): string {

    return this.walletAddress

  }

  /*
  GET RECENT TRANSACTIONS
  */

  async getTransactions(limit: number = 20): Promise<any[]> {

    const provider: any = this.tonweb.provider

    const res = await provider.getTransactions(
      this.walletAddress,
      limit
    )

    return res

  }

  /*
  PARSE PAYMENT
  */

  parseTransaction(tx: any): TonPayment | null {

    try {

      const inMsg = tx.in_msg

      if (!inMsg) return null

      const amount =
        Number(inMsg.value) / 1_000_000_000

      const from = inMsg.source
      const to = inMsg.destination

      const comment =
        inMsg.message || undefined

      return {

        hash: tx.transaction_id.hash,
        from,
        to,
        amount,
        comment

      }

    } catch (err) {

      return null

    }

  }

  /*
  FIND USER PAYMENT
  */

  async findPaymentByComment(
    comment: string
  ): Promise<TonPayment | null> {

    const txs = await this.getTransactions(50)

    for (const tx of txs) {

      const parsed = this.parseTransaction(tx)

      if (!parsed) continue

      if (parsed.comment === comment) {

        return parsed

      }

    }

    return null

  }

  /*
  SEND WITHDRAWAL
  */

  async sendWithdrawal(
    toAddress: string,
    amount: number,
    wallet: any,
    secretKey: Uint8Array
  ) {

    const nano = TonWeb.utils.toNano(amount.toString())

    const seqno = await wallet.methods
      .seqno()
      .call()

    const transfer = wallet.methods.transfer({

      secretKey,

      toAddress,

      amount: nano,

      seqno,

      payload: "withdrawal"

    })

    const result = await transfer.send()

    return result

  }

}
