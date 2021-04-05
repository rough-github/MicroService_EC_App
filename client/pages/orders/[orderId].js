import {useState, useEffect} from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks/use-request"

const OrderShow = ({order, currentUser}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const {doRequest: paymentRequest, errors: paymentErrors} = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })
  const {doRequest: cancellRequest, errors: CancellErrors} = useRequest({
    url: `/api/orders/${order.id}`,
    method: "delete",
    body: {},
    onSuccess: () => Router.push("/")
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    }
  }, [order])

  if(timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div>
      <h4>Time left to pay: {timeLeft} seconds.</h4>
      <StripeCheckout 
        token={({id}) => paymentRequest({token: id})}
        stripeKey=""
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {paymentErrors}
      <button onClick={cancellRequest} className="btn btn-danger">Cancell Order</button>
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const {orderId} = context.query;
  const {data} = await client.get(`/api/orders/${orderId}`);

  return {order: data};
}

export default OrderShow;