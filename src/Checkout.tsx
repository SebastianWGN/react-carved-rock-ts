  
import React, { useState } from "react";
import { saveShippingAddress } from "./services/shippingService";

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};


interface CartItm{
  id: string
  sku: string
  quantity: number
}

interface Address{
  id: number
  city: string
  country: string
}

interface IProps{
  cart: Array<CartItm>
  emptyCart: () => void
}

// Declaring outside component to avoid recreation on each render
const emptyAddress: Address = {
  id: 0,
  city: "",
  country: "",
};


export default function Checkout({ cart, emptyCart }: IProps) {
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState<Address>(emptyAddress);

  // Derived state
  const errors:any = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.persist(); // persist the event
    setAddress((curAddress) => {
      return {
        ...curAddress,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.persist(); // persist the event
    setAddress((curAddress) => {
      return {
        ...curAddress,
        [e.target.id]: e.target.value,
      };
    });
  }

  
  function handleBlur(event: React.FocusEvent<HTMLSelectElement>) {
    event.persist();
    setTouched((cur) => {
      return { ...cur, [event.target.id]: true };
    });
  }

  function handleBlurInput(event: React.FocusEvent<HTMLInputElement>) {
    event.persist();
    setTouched((cur) => {
      return { ...cur, [event.target.id]: true };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    try {
      await saveShippingAddress(address);
      emptyCart();
      setStatus(STATUS.COMPLETED);
    } catch (e) {
      setSaveError(e);
    }
  }

  function getErrors(address: Address) {
    const result : Address = { id:0, city: "", country: ""};
    if (!address.city) result.city = "City is required";
    if (!address.country) result.country = "Country is required";
    return result;
  }

  if (saveError) throw saveError;
  if (status === STATUS.COMPLETED) {
    return <h1>Thanks for shopping!</h1>;
  }

  return (
    <>
      <h1>Shipping Info</h1>
      {!isValid && status === STATUS.SUBMITTED && (
        <div role="alert">
          <p>Please fix the following errors:</p>
          {<ul>
            {Object.keys(errors).map((key) => {
              return <li key={key}>{errors[key]}</li>;
            })}
          </ul> }
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={address.city}
            onBlur={handleBlurInput}
            onChange={handleChangeInput}
          />
          <p role="alert">
            {(touched.city || status === STATUS.SUBMITTED) && errors.city}
          </p>
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={address.country}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="USA">USA</option>
            <option value="Peru">Peru</option>
          </select>

          <p role="alert">
            {(touched.country || status === STATUS.SUBMITTED) && errors.country}
          </p>
        </div>

        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Shipping Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
