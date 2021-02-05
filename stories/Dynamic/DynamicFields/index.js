import React from 'react';
import withDocs from '../../utils/withDocs';
import readme from './README.md';
import FormState from '../../utils/FormState';

import {
  Form,
  Text,
  RadioGroup,
  Radio,
  Relevant,
  ArrayField
} from '../../../src';

// const DynamicFields = () => (
//   <div>
//     <Form>
//       {({ formState }) => (
//         <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//           <div style={{ flex: 1, marginRight: '2rem' }}>
//             <label>First name:<Text field="name"/></label>
//             <label>Are you married?</label>
//             <RadioGroup field="married">
//               <label>Yes <Radio value="yes"/></label>
//               <label>No <Radio value="no"/></label>
//             </RadioGroup>
//             {formState.values.married === 'yes' ? (
//               <label >Spouse name:<Text field="spouse" /></label>
//             ) : null}
//             <button type="submit">Submit</button>
//           </div>
//           <div style={{ flex: 2, minWidth: '300px' }}>
//             <FormState />
//           </div>
//         </div>
//       )}
//     </Form>
//   </div>
// );

const DynamicFields = () => (
  <div>
    <Form>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, marginRight: '2rem' }}>
          <label>
            First name:
            <Text field="name" />
          </label>
          <label>Are you married?</label>
          <RadioGroup field="married">
            <label>
              Yes <Radio value="yes" />
            </label>
            <label>
              No <Radio value="no" />
            </label>
          </RadioGroup>
          <Relevant when={({ values }) => values.married === 'yes'}>
            <label>
              Spouse name:
              <Text field="spouse" />
            </label>

            {/* <h5>Siblings:</h5>
            <ArrayField
              field="siblings"
              keepState
              initialValue={[
                { first: 'Foo', last: 'ahh' },
                { first: 'Bar', last: 'last' }
              ]}>
              {({ add, reset }) => (
                <>
                  <button type="button" onClick={add}>
                    Add Sibling
                  </button>
                  <button type="button" onClick={reset}>
                    Reset Siblings
                  </button>
                  <ArrayField.Items>
                    {({ remove, field, index }) => (
                      <label>
                        Sibling {index}:
                        <Text field={`${field}.first`} keepState />
                        Sibling {index}:
                        <Text field={`${field}.last`} keepState />
                        <button type="button" onClick={remove}>
                          Remove
                        </button>
                      </label>
                    )}
                  </ArrayField.Items>
                </>
              )}
            </ArrayField> */}
          </Relevant>
          <button type="submit">Submit</button>
        </div>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <FormState />
        </div>
      </div>
    </Form>
  </div>
);

export default withDocs(readme, DynamicFields);
