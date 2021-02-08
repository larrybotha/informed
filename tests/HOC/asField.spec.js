import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Form, asField, BasicText } from '../../src';

describe('asField', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.restore();
  });

  const validate = value => {
    return !value || value.length < 5
      ? 'Field must be at least five characters'
      : undefined;
  };

  const BasicErrorText = asField(({ fieldState, ...props }) => (
    <React.Fragment>
      <BasicText
        fieldState={fieldState}
        {...props}
        style={fieldState.error ? { border: 'solid 1px red' } : null}
      />
      {fieldState.error ? (
        <small style={{ color: 'red' }}>{fieldState.error}</small>
      ) : null}
    </React.Fragment>
  ));

  it('should update value when user types', () => {
    let savedApi;
    const wrapper = mount(
      <Form
        getApi={api => {
          savedApi = api;
        }}>
        <BasicErrorText field="greeting" validate={validate}/>
      </Form>
    );
    let input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Hi!' } });
    input = wrapper.find('input');
    expect(input.props().value).to.equal('Hi!');
    expect(savedApi.getState().values).to.deep.equal({ greeting: 'Hi!' });
  });

  it('should show error message when validation error occurs', () => {
    let savedApi;
    const wrapper = mount(
      <Form
        getApi={api => {
          savedApi = api;
        }}>
        <BasicErrorText 
          field="greeting" 
          validateOnChange
          validate={validate}/>
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Hi!' } });
    const error = wrapper.find('small');
    expect(error.text()).to.equal('Field must be at least five characters');
  });

  const ErrorText = asField(({ fieldState, fieldApi, ...props }) => {
    const { value } = fieldState;
    const { setValue, setTouched } = fieldApi;
    const { onChange, onBlur, forwardedRef, ...rest } = props;
    return (
      <React.Fragment>
        <input
          {...rest}
          ref={forwardedRef}
          value={!value && value !== 0 ? '' : value}
          onChange={e => {
            setValue(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
          onBlur={e => {
            setTouched();
            if (onBlur) {
              onBlur(e);
            }
          }}
          style={fieldState.error ? { border: 'solid 1px red' } : null}
        />
        {fieldState.error ? (
          <small style={{ color: 'red' }}>{fieldState.error}</small>
        ) : null}
      </React.Fragment>
    );
  });

  it('should update value when user types', () => {
    let savedApi;
    const wrapper = mount(
      <Form
        getApi={api => {
          savedApi = api;
        }}>
        <ErrorText field="greeting" validate={validate}/>
      </Form>
    );
    let input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Hi!' } });
    input = wrapper.find('input');
    expect(input.props().value).to.equal('Hi!');
    expect(savedApi.getState().values).to.deep.equal({ greeting: 'Hi!' });
  });

  it('should show error message when validation error occurs', () => {
    let savedApi;
    const wrapper = mount(
      <Form
        getApi={api => {
          savedApi = api;
        }}>
        <ErrorText 
          field="greeting" 
          validateOnChange
          validate={validate}/>
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Hi!' } });
    const error = wrapper.find('small');
    expect(error.text()).to.equal('Field must be at least five characters');
  });

  const htmlAttributeCases = [
    {field: 'id', attribute: 'id', value: 'foo'},
    {field: 'required', attribute: 'required', value: true},
    {field: 'multiple', attribute: 'multiple', value: true}
  ];

  htmlAttributeCases.forEach(({field, attribute, value}) => {
    it(`should preserve valid HTML attribute '${attribute}' passed in by user`, () => {
      const props = {[attribute]: value}
      const Field = asField(({ fieldState: _fs, fieldApi: _fa, ...props }) => (
	<input {...props} />
      ))
      const wrapper = mount(<Field field={field} {...props}/>);
      const input = wrapper.find('input');

      expect(input.props()[attribute]).to.equal(value);
    });
  })

  it(`should return an id attribute if one isn't provided`, () => {
    const Field = asField(({ fieldState: _fs, fieldApi: _fa, ...props }) => (
      <input {...props} />
    ))
    const wrapper = mount(<Field field="foo" />);
    const input = wrapper.find('input');

    expect(input.props().id).to.exist
  });
});
