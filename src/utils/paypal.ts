import paypal, { Item, Payment } from 'paypal-rest-sdk'

export const paypalConfig = {
  mode: 'sandbox', //sandbox || live
  client_id: 'AR7atXsx0yBFDeytWQ61bSm7drrQfURmcc2VAQGUi-n8U_-lmHHqV4cL6MF-hTAGwIct3sH__x3WuHoC',
  client_secret: 'EPuLlEEYcMR3xdHGRntWx3NtNsrYyAA0RK1R9fG2WE92prsZIIsOtOYyxCR9mA5jMCxBjdM0KE8mRRTb'
}

paypal.configure(paypalConfig)

export const paypal_util = (productCart: Item[], order_id: string, discount: number) => {
  const totalMoney = productCart.reduce((sum, cartItem) => sum + Number(cartItem.price) * cartItem.quantity, 0)

  const payment_object: Payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: `http://localhost:3000/payments/paypal-success/${order_id}`,
      cancel_url: `http://localhost:3000/payments/paypal-failed/${order_id}`
    },
    transactions: [
      {
        item_list: {
          items: productCart
        },
        amount: {
          currency: 'USD',
          total: (totalMoney - discount).toString(),
          details: {
            subtotal: totalMoney.toString(),
            shipping: (discount * -1).toString()
          }
        },
        description: 'POPS & Paypal ©2023 Pham Nguyen Khoi Nguyen'
      }
    ]
  }

  return new Promise<any>((resolve, reject) => {
    paypal.payment.create(payment_object, function (error: any, payment: any) {
      if (error) {
        return reject(error)
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return resolve(payment.links[i])
          }
        }
      }
    })
  })
}
