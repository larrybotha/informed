import React from 'react';
import withDocs from '../../utils/withDocs';
import readme from './README.md';
import Code from '../../utils/Code';

import { Form, Select, Option, useFormState } from '../../../src';

const FormState = () => {
  const formState = useFormState();
  return (
    <Code language="language-js">
      {JSON.stringify(formState.values, null, 2)}
    </Code>
  );
};

// const options = ['red', 'green', 'blue', 'orange', 'purple'];

const MultiSelectInput = () => {
  // const [ initialValue, setInitialValue ] = useState( ['green', 'yellow'] );

  // const toggle = () => {
  //   const color1 = options[ Math.floor(Math.random() * 5) ];
  //   let color2 = options[ Math.floor(Math.random() * 5) ];
  //   while( color1 === color2 ){
  //     color2 = options[ Math.floor(Math.random() * 5) ];
  //   }
  //   setInitialValue( [ color1, color2 ] );
  // };

  return (
    <Form id="select-colors-form">
      <div>
        <label>
          Colors:
          <Select
            // initialValue={initialValue}
            field="colors"
            id="select-colors"
            multiple
            style={{ height: '100px', width: '200px' }}>
            <Option value="red">Red</Option>
            <Option value="green">Green</Option>
            <Option value="blue">Blue</Option>
            <Option value="yellow">Yellow</Option>
            <Option value="orange">Orange</Option>
            <Option value="purple">Purple</Option>
          </Select>
        </label>
        <button type="submit">Submit</button>
        {/* <button type="reset">Reset</button>
        <button type="toggle" type="button" onClick={toggle}>Toggle</button> */}
        <FormState />
        {/* {JSON.stringify(initialValue)} */}
      </div>
    </Form>
  );
};

const MultiSelectInputWrapper = () => {
  return <MultiSelectInput />;
};

export default withDocs(readme, MultiSelectInputWrapper);
