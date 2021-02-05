# Form State

**`Informed` takes care of state so you don't have to!**

Below is a table that describes each value within a forms state.

**Note:** Initial value is the default value for an attribute, and derived describes
whether or not the attribute is derived from other attributes. For example,
invalid is derived from the errors attribute and therefore cannot be set directly.

| Attribute | Example            | Initial Value | Derived | Description                                                                                                                                                                                        |
| --------- | ------------------ | ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| values    | `{name:'Joe'}`     | `{}`          | NO      | Key value pair where key is the form field and value is the value entered or selected.                                                                                                             |
| touched   | `{name:true}`      | `{}`          | NO      | Key value pair where key is the form field and value is true or undefined ( touched or untouched ). Submitting form will cause all fields to be touched.                                           |
| errors    | `{name:'Invalid'}` | `{}`          | NO      | Key value pair where key is the form field and value is the error associated with that field. If a validate function is provided to an input, then when it is called this object will be modified. |
| invalid   | `true`             | `false`       | YES     | Boolean that is true when form is invalid. A form is invalid when any of its inputs fails its validation function ( if there are errors ).                                                         |
| pristine  | `true`             | `true`        | YES     | Boolean that is true when form is pristine. A form is pristine when it has not been touched && no values have been entered in any field                                                            |
| dirty     | `true`             | `false`       | YES     | Boolean that is true when pristine is false                                                                                                                                                        |
| submits   | `1`                | `0`           | YES     | Number of times the form was submitted. ( Successful or Unsuccessful )                                                                                                                             |
| error     | `Invalid form`     | undefined     | NO      | Result of the form level validation function                                                                                                                                                       |

**"Ok so informed takes care of state so I dont have to.. but how do i get my hands
on this state??**

Thats a great question! There are many ways so lets take a look at a few!

Below is an example that shows you how to access the form state and render out
the values that are changing.

<!-- STORY -->

```jsx
import { Form, Text } from 'informed';

const validate = value => {
  return !value || value.length < 5
    ? 'Field must be longer than five characters'
    : undefined;
};

const validateForm = values => {
  return values.name === 'Joseph' ? 'Username is already taken!' : undefined;
};

<Form validate={validateForm}>
  {({ formState }) => (
    <div>
      <label>
        First name:
        <Text field="name" validate={validate} />
      </label>
      <button type="submit">Submit</button>
      <label>Values:</label>
      <code>{JSON.stringify(formState.values)}</code>
      <label>Touched:</label>
      <code>{JSON.stringify(formState.touched)}</code>
      <label>Errors:</label>
      <code>{JSON.stringify(formState.errors)}</code>
      <label>Invalid:</label>
      <code>{JSON.stringify(formState.invalid)}</code>
      <label>Pristine:</label>
      <code>{JSON.stringify(formState.pristine)}</code>
      <label>Dirty:</label>
      <code>{JSON.stringify(formState.dirty)}</code>
      <label>Submits:</label>
      <code>{JSON.stringify(formState.submits)}</code>
      <label>Error:</label>
      <code>{JSON.stringify(formState.error)}</code>
    </div>
  )}
</Form>;
```

### What is this magic?

Its not magic, its a Function As A Child, or otherwise known as [render props](https://reactjs.org/docs/render-props.html)

There are five ways you can get access to `Informed`s form state.

1. By accessing the `formState` as a parameter to a child render function.

```jsx
<Form>
  {({ formState }) => (
    <div>
      <Text field="hello" />
      <button type="submit">Submit</button>
      <label>Values:</label>
      <code>{JSON.stringify(formState.values)}</code>
      <label>Touched:</label>
      <code>{JSON.stringify(formState.touched)}</code>
    </div>
  )}
</Form>
```

<br/>
2) By accessing the `formState` as a parameter to a render prop.

```jsx
<Form
  render={({ formState }) => (
    <div>
      <Text field="hello" />
      <button type="submit">Submit</button>
      <label>Values:</label>
      <code>{JSON.stringify(formState.values)}</code>
      <label>Touched:</label>
      <code>{JSON.stringify(formState.touched)}</code>
    </div>
  )}
/>
```

<br/>
3) By accessing the `formState` as a prop to a component prop.

```jsx
const FormContent = ({ formState }) => (
  <div>
    <Text field="hello" />
    <button type="submit">Submit</button>
    <label>Values:</label>
    <code>{JSON.stringify(formState.values)}</code>
    <label>Touched:</label>
    <code>{JSON.stringify(formState.touched)}</code>
  </div>
);

<Form component={FormContent} />;
```

<br/>
4) By accessing the `formState` as a prop via a HOC ( High Order Component ).

```jsx
const FormState = withFormState(({ formState }) => (
  <label>Values:</label>
  <code>{JSON.stringify(formState.values)}</code>
  <label>Touched:</label>
  <code>{JSON.stringify(formState.touched)}</code>
));

<Form>
  <div>
    <Text field="hello" />
    <button type="submit">Submit</button>
    <FormState />
  </div>
</Form>
```

<br/>
5) By accessing the `formState` via Hooks!

```jsx
const FormState = () => {
  const formState = useFormState();
  return (
    <label>Values:</label>
    <code>{JSON.stringify(formState.values)}</code>
    <label>Touched:</label>
    <code>{JSON.stringify(formState.touched)}</code>
  );
};

<Form>
  <div>
    <Text field="hello" />
    <button type="submit">Submit</button>
    <FormState />
  </div>
</Form>
```

<br/>
So if you do need access to the form state, any of these methods will work.

### Ok so what if i need the state outside of the `<Form />` ??

Don't fret! This is also very simple. You have two options:

1. Use the Forms `onChange` prop.

```jsx
<Form onChange={formState => console.log(formState)}>
  <Text field="hello" />
  <button type="submit">Submit</button>
</Form>
```

  <br/>
  2) Use the Forms `apiRef` prop, and then use the apis `getState` function.

```jsx
import React, { useRef } from 'react';
import { Form, Text } from 'informed';

const MyAwesomeForm = () => {
  const apiRef = useRef();

  const handleClick = () => {
    console.log(apiRef.current.getState());
  };

  return (
    <div>
      <Form apiRef={apiRef}>
        <Text field="hello" />
        <button type="submit">Submit</button>
      </Form>
      <button onClick={handleClick}>Print Form State</button>
    </div>
  );
};
```
