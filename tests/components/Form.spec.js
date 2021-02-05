import React, { useState } from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Form, Text, Scope } from '../../src';

describe('Form', () => {
  const sandbox = sinon.createSandbox();

  const checkFormApi = api => {
    expect(api).to.have.own.property('setError');
    expect(api).to.have.own.property('setTouched');
    expect(api).to.have.own.property('setValue');
    expect(api).to.have.own.property('submitForm');
    expect(api).to.have.own.property('reset');
    expect(api).to.have.own.property('getState');
  };

  afterEach(() => {
    sandbox.restore();
  });

  const checkFormState = state => {
    const formState = {
      pristine: true,
      dirty: false,
      invalid: false,
      submits: 0,
      step: 0,
      validating: 0,
      submitting: false,
      values: {},
      errors: {},
      touched: {}
    };
    expect(JSON.stringify(state)).to.deep.equal(JSON.stringify(formState));
  };

  const getState = state => {
    const defaultState = {
      values: {},
      touched: {},
      errors: {},
      pristine: true,
      dirty: false,
      invalid: false,
      submits: 0,
      step: 0,
      submitting: false,
      validating: 0
    };
    return Object.assign({}, defaultState, state);
  };

  beforeEach(() => {
    sandbox.restore();
  });

  it('should display large form', () => {
    const wrapper = mount(
      <Form>
        <Text field="foo" />
        <Text field="bar" />
        <Text field="baz" />
        <Text field="raz" />
        <Text field="taz" />
        <Text field="naz" />
        <Text field="laz" />
        <Text field="ahh" />
        <Text field="baa" />
        <Text field="zaa" />
        <Text field="taa" />
        <Text field="faa" />
        <Text field="laa" />
        <Text field="bru" />
      </Form>
    );
    expect(wrapper.find(Text).length).to.equal(14);
  });

  it('should call onChange function when value changes', () => {
    const spy = sandbox.spy();
    let wrapper;
    act(() => {
      wrapper = mount(
        <Form onChange={spy}>{() => <Text field="greeting" />}</Form>
      );
    });

    const input = wrapper.find('input');

    act(() => {
      input.simulate('change', { target: { value: 'hello' } });
    });

    expect(spy.called).to.equal(true);
    expect(spy.args[0][0].values).to.deep.equal({ greeting: 'hello' });
  });

  it('does not apply unnecessary props to the form element', () => {
    const excludedProps = {
      getApi: () => {},
      dontPreventDefault: true,
      onSubmitFailure: () => {},
      initialValues: {},
      onValueChange: () => {},
      onChange: () => {}
    };
    const wrapper = mount(
      <Form {...excludedProps}>{() => <Text field="greeting" />}</Form>
    );
    const input = wrapper.find('form');
    expect(input.props()).to.not.have.any.keys(...Object.keys(excludedProps));
  });

  it('should call onValueChange function when value changes', () => {
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form onValueChange={spy}>{() => <Text field="greeting" />}</Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    expect(spy.called).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' });
  });

  it('should call onSubmit function with values when the form is submitted', () => {
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form onSubmit={spy}>
        <Text field="greeting" />
        <button type="submit">Submit</button>
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(spy.called).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' });
  });

  it('should call reset function when reset button is clicked', () => {
    let savedApi;
    const wrapper = mount(
      <Form
        getApi={api => {
          savedApi = api;
        }}>
        <Text field="greeting" />
        <button type="reset">Reset</button>
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    expect(savedApi.getState().values).to.deep.equal({ greeting: 'hello' });
    const button = wrapper.find('button');
    button.simulate('reset');
    expect(savedApi.getState().values).to.deep.equal({});
  });

  it('should call reset function when reset button is clicked', () => {
    let savedApi;

    const ResetTester = () => {
      const [init, setInit] = useState('init');
      return (
        <Form
          getApi={api => {
            savedApi = api;
          }}>
          <Text initialValue={init} field="greeting" />
          <button id="reset" type="reset">
            Reset
          </button>
          <button id="update" onClick={() => setInit('new')}>
            Update
          </button>
        </Form>
      );
    };
    const wrapper = mount(<ResetTester />);
    const updateButton = wrapper.find('button#update');
    updateButton.simulate('click');
    const button = wrapper.find('button#reset');
    button.simulate('reset');
    expect(savedApi.getState().values).to.deep.equal({ greeting: 'new' });
  });

  it('should call onReset function when the form is reset when reset button is clicked', () => {
    const spy = sandbox.spy();

    const wrapper = mount(
      <Form onReset={spy}>
        <Text field="a" />
        <Text field="b" />
        <button type="reset">Reset</button>
      </Form>
    );
    const button = wrapper.find('button');
    button.simulate('reset');
    expect(spy.called).to.equal(true);
  });

  it('should update onReset function when the onReset prop changes', () => {
    const dummy1 = sandbox.spy();
    const dummy2 = sandbox.spy();
    const wrapper = mount(
      <Form onReset={dummy1}>
        <Text field="greeting" />
        <button type="reset">Reset</button>
      </Form>
    );
    wrapper.setProps({ onReset: dummy2 });

    const button = wrapper.find('button');
    button.simulate('reset');
    expect(dummy1.called).to.equal(false);
    expect(dummy2.called).to.equal(true);
  });

  it('should call onReset function when the form is reset via api reset function', () => {
    let api;
    const spy = sandbox.spy();
    const setApi = param => {
      api = param;
    };
    mount(
      <Form onReset={spy} getApi={setApi}>
        <Text field="greeting" />
      </Form>
    );

    api.reset();
    expect(spy.called).to.equal(true);
  });

  it('should call preventDefault when the form is submitted', () => {
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form onSubmit={() => {}}>
        <button type="submit">Submit</button>
      </Form>
    );
    const button = wrapper.find('button');
    button.simulate('submit', {
      preventDefault: spy
    });
    expect(spy.called).to.equal(true);
  });

  it('should NOT preventDefault dontPreventDefault is passed in', () => {
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form onSubmit={() => {}} dontPreventDefault>
        <button type="submit">Submit</button>
      </Form>
    );
    const button = wrapper.find('button');
    button.simulate('submit', {
      preventDefault: spy
    });
    expect(spy.called).to.equal(false);
  });

  it('should NOT call onSubmit function with values when the invalid form is submitted due to invalid field validation', () => {
    const spy = sandbox.spy();
    let api;
    const setApi = param => {
      api = param;
    };
    const validate = greeting =>
      greeting === 'hello!' ? 'ooo thats no good' : null;
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi}>
        <Text field="greeting" validate={validate} />
        <button type="submit">Submit</button>
      </Form>
    );
    api.setValue('greeting', 'hello!');
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(spy.called).to.equal(false);
  });

  it('should NOT call onSubmit function with values when the invalid form is submitted due to invalid form validation', () => {
    const spy = sandbox.spy();
    let api;
    const setApi = param => {
      api = param;
    };
    const validate = values =>
      values.a + values.b !== 4 ? 'values must sum to 4!' : undefined;
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi} validate={validate}>
        <Text field="a" />
        <Text field="b" />
        <button type="submit">Submit</button>
      </Form>
    );
    api.setValue('a', 1);
    api.setValue('b', 2);
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(spy.called).to.equal(false);
  });

  it('should call onSubmit function with values when the valid form is submitted due to valid form validation', () => {
    const spy = sandbox.spy();
    let api;
    const setApi = param => {
      api = param;
    };
    const validate = values =>
      values.a + values.b !== 4 ? 'values must sum to 4!' : undefined;
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi} validate={validate}>
        <Text field="a" />
        <Text field="b" />
        <button type="submit">Submit</button>
      </Form>
    );
    api.setValue('a', 2);
    api.setValue('b', 2);
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(spy.called).to.equal(true);
  });

  it('should NOT call onSubmit function with values when the invalid form is submitted due to invalid form level field validation', () => {
    const spy = sandbox.spy();
    let api;
    const setApi = param => {
      api = param;
    };
    const validate = ({ a, b }) => {
      return {
        a: a.length < 4 ? 'please enter more than 3 characters' : undefined,
        b: b.length < 4 ? 'please enter more than 3 characters' : undefined
      };
    };
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi} validateFields={validate}>
        <Text field="a" />
        <Text field="b" />
        <button type="submit">Submit</button>
      </Form>
    );
    api.setValue('a', 'asd');
    api.setValue('b', 'as');
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(spy.called).to.equal(false);
  });

  it('should update onSubmit function when the onSubmit prop changes', () => {
    const dummy1 = sandbox.spy();
    const dummy2 = sandbox.spy();
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form onSubmit={dummy1}>
        <Text field="greeting" />
        <button type="submit">Submit</button>
      </Form>
    );
    wrapper.setProps({ onSubmit: dummy2 });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    wrapper.setProps({ onSubmit: spy });
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(dummy1.called).to.equal(false);
    expect(dummy2.called).to.equal(false);
    expect(spy.called).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' });
  });

  it('should update validateFields function when the validateFields prop changes', () => {
    const dummy1 = sandbox.spy();
    const dummy2 = sandbox.spy();
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form validateFields={dummy1}>
        <Text field="greeting" />
        <button type="submit">Submit</button>
      </Form>
    );
    wrapper.setProps({ validateFields: dummy2 });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    wrapper.setProps({ validateFields: spy });
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(dummy1.called).to.equal(false);
    expect(dummy2.called).to.equal(false);
    expect(spy.called).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' });
  });

  it('should set correct errors when invalid form level field validation', () => {
    const spy = sandbox.spy();
    let api;
    const setApi = param => {
      api = param;
    };
    const validate = ({ a, b }) => {
      return {
        a: a.length < 4 ? 'please enter more than 3 characters' : undefined,
        b: b.length < 4 ? 'please enter more than 3 characters' : undefined
      };
    };
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi} validateFields={validate}>
        <Text field="a" />
        <Text field="b" />
        <button type="submit">Submit</button>
      </Form>
    );
    api.setValue('a', 'asd');
    api.setValue('b', 'as');
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(api.getState().errors).to.eql({
      a: 'please enter more than 3 characters',
      b: 'please enter more than 3 characters'
    });
  });

  it('should reset form error after invalid form is submitted and value is changed', () => {
    const spy = sandbox.spy();
    let api;
    const setApi = param => {
      api = param;
    };
    const validate = values =>
      values.a + values.b !== 4 ? 'values must sum to 4!' : undefined;
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi} validate={validate}>
        <Text field="a" />
        <Text field="b" />
        <button type="submit">Submit</button>
      </Form>
    );
    api.setValue('a', 1);
    api.setValue('b', 2);
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(api.getState().error).to.equal('values must sum to 4!');
    api.setValue('a', 3);
    expect(api.getState().error).to.be.undefined;
  });

  it('should call onSubmitFailure function with errors when the invalid form is submitted', () => {
    const spy = sandbox.spy();
    let api;
    const setApi = param => {
      api = param;
    };
    const validate = greeting =>
      greeting === 'hello!' ? 'ooo thats no good' : null;
    const wrapper = mount(
      <Form onSubmitFailure={spy} getApi={setApi}>
        <Text field="greeting" validate={validate} />
        <button type="submit">Submit</button>
      </Form>
    );
    api.setValue('greeting', 'hello!');
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(spy.called).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({ greeting: 'ooo thats no good' });
  });

  it('should incriment submits when form is submitted', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
        <button type="submit">Submit</button>
      </Form>
    );
    const button = wrapper.find('button');
    button.simulate('submit');
    expect(api.getState().submits).to.equal(1);
  });

  it('should incriment submits when form is submitted more than once', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
        <button type="submit">Submit</button>
      </Form>
    );
    const button = wrapper.find('button');
    button.simulate('submit');
    button.simulate('submit');
    button.simulate('submit');
    expect(api.getState().submits).to.equal(3);
  });

  it('getApi should give the passed function the formApi', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    checkFormApi(api);
  });

  it('apiRef should give the passed ref the formApi', () => {
    const apiRef = {};
    mount(<Form apiRef={apiRef}>{() => <Text field="greeting" />}</Form>);
    checkFormApi(apiRef.current);
  });

  it('should set initial values when initial values are passed', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi} initialValues={{ greeting: 'hello' }}>
        {() => <Text field="greeting" />}
      </Form>
    );
    expect(api.getState().values).to.deep.equal({ greeting: 'hello' });
  });

  it('should set initial values and mask them when initial values are passed with mask function', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const mask = val => `$${val}`;
    mount(
      <Form getApi={setApi} initialValues={{ greeting: 'hello' }}>
        {() => <Text field="greeting" mask={mask} />}
      </Form>
    );
    expect(api.getState().values).to.deep.equal({ greeting: '$hello' });
  });

  it('should set initial values and mask them when initial values are passed with mask function then update correctly when typed in', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const mask = val => `$${val}`;
    const wrapper = mount(
      <Form getApi={setApi} initialValues={{ greeting: 'hello' }}>
        {() => <Text field="greeting" mask={mask} />}
      </Form>
    );
    expect(api.getState().values).to.deep.equal({ greeting: '$hello' });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'woooo' } });
    expect(api.getState().values).to.deep.equal({ greeting: '$woooo' });
  });

  it('should run format and parse when user passes initial values and format and parse are passed', () => {
    let savedApi;
    const format = value => `$${value}`;
    const parse = value => value.replace('$', '');
    const wrapper = mount(
      <Form
        initialValues={{ hello: '1234' }}
        getApi={api => {
          savedApi = api;
        }}>
        <Text field="hello" format={format} parse={parse} />
      </Form>
    );
    expect(wrapper.find('input').props().value).to.equal('$1234');
    expect(savedApi.getState().values).to.deep.equal({ hello: '1234' });
  });

  // TODO verify this is depricated
  it.skip('setState should set the formState', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    api.setState({ values: { greeting: 'hello' } });
    expect(api.getState().values).to.deep.equal({ greeting: 'hello' });
  });

  it('setValues should set the forms values', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
        <Text field="name" />
        <Scope scope="favorite">
          <Text field="color" />
          <Text field="food" />
        </Scope>
      </Form>
    );
    api.setValues({
      greeting: 'hello',
      name: 'joe',
      favorite: {
        color: 'green'
      }
    });
    expect(api.getState().values).to.deep.equal({
      greeting: 'hello',
      name: 'joe',
      favorite: {
        color: 'green'
      }
    });
  });

  it('setValues should set the forms values to undefined when empty strings are passed', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
        <Text field="name" />
        <Scope scope="favorite">
          <Text field="color" />
          <Text field="food" />
        </Scope>
      </Form>
    );
    api.setValues({
      greeting: '',
      name: '',
      favorite: {
        color: ''
      }
    });
    expect(api.getState().values).to.deep.equal({});
  });

  it('setValues should set the forms values even when value is null or empty string', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text field="greeting" allowEmptyString />
        <Text field="name" />
        <Scope scope="favorite">
          <Text field="color" />
          <Text field="food" />
        </Scope>
      </Form>
    );
    api.setValues({
      greeting: '',
      name: null,
      favorite: {
        color: false
      }
    });
    expect(api.getState().values).to.deep.equal({
      greeting: '',
      name: null,
      favorite: {
        color: false
      }
    });
  });

  it('setValues should set the forms values to empty strings when allowEmptyStrings prop is passed to form', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi} allowEmptyStrings>
        <Text field="greeting" />
        <Text field="name" />
        <Scope scope="favorite">
          <Text field="color" />
          <Text field="food" />
        </Scope>
      </Form>
    );
    api.setValues({
      greeting: '',
      name: '',
      favorite: {
        color: ''
      }
    });
    expect(api.getState().values).to.deep.equal({
      greeting: '',
      name: '',
      favorite: {
        color: ''
      }
    });
  });

  it('resetField should reset a field to its initial state via initialValue prop on input', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="greeting" initialValue="ayyyoooooo" />
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    expect(api.getState().values).to.deep.equal({ greeting: 'hello' });
    expect(api.getState()).to.deep.equal(
      getState({ values: { greeting: 'hello' }, pristine: false, dirty: true })
    );
    api.resetField('greeting');
    expect(api.getState()).to.deep.equal(
      getState({
        values: { greeting: 'ayyyoooooo' },
        pristine: false,
        dirty: true
      })
    );
  });

  it('resetField should reset a field to its initial state via initialValue prop on form', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi} initialValues={{ greeting: 'ayyyoooooo' }}>
        <Text field="greeting" />
      </Form>
    );
    expect(api.getState().values).to.deep.equal({ greeting: 'ayyyoooooo' });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    expect(api.getState().values).to.deep.equal({ greeting: 'hello' });
    expect(api.getState()).to.deep.equal(
      getState({ values: { greeting: 'hello' }, pristine: false, dirty: true })
    );
    api.resetField('greeting');
    expect(api.getState()).to.deep.equal(
      getState({
        values: { greeting: 'ayyyoooooo' },
        pristine: false,
        dirty: true
      })
    );
  });

  it('reset should reset the form to its initial state via initialValue prop on input', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="greeting" initialValue="ayyyoooooo" />
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    expect(api.getState().values).to.deep.equal({ greeting: 'hello' });
    expect(api.getState()).to.deep.equal(
      getState({ values: { greeting: 'hello' }, pristine: false, dirty: true })
    );
    api.reset();
    expect(api.getState()).to.deep.equal(
      getState({
        values: { greeting: 'ayyyoooooo' },
        pristine: false,
        dirty: true
      })
    );
  });

  it('reset should reset the form to its initial state via initialValue prop on form', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi} initialValues={{ greeting: 'ayyyoooooo' }}>
        <Text field="greeting" />
      </Form>
    );
    expect(api.getState().values).to.deep.equal({ greeting: 'ayyyoooooo' });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    expect(api.getState().values).to.deep.equal({ greeting: 'hello' });
    expect(api.getState()).to.deep.equal(
      getState({ values: { greeting: 'hello' }, pristine: false, dirty: true })
    );
    api.reset();
    expect(api.getState()).to.deep.equal(
      getState({
        values: { greeting: 'ayyyoooooo' },
        pristine: false,
        dirty: true
      })
    );
  });

  it('reset should reset the form to its initial state via initialValue prop on input with scope', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Scope scope="favorite">
          <Text field="color" initialValue="red" />
        </Scope>
      </Form>
    );
    expect(api.getState()).to.deep.equal(
      getState({
        values: { favorite: { color: 'red' } },
        pristine: false,
        dirty: true
      })
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'green' } });
    expect(api.getState()).to.deep.equal(
      getState({
        values: { favorite: { color: 'green' } },
        pristine: false,
        dirty: true
      })
    );
    api.reset();
    expect(api.getState()).to.deep.equal(
      getState({
        values: { favorite: { color: 'red' } },
        pristine: false,
        dirty: true
      })
    );
  });

  it('reset should reset the form to its initial state via initialValue prop on form with scope', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi} initialValues={{ favorite: { color: 'red' } }}>
        <Scope scope="favorite">
          <Text field="color" />
        </Scope>
      </Form>
    );
    expect(api.getState()).to.deep.equal(
      getState({
        values: { favorite: { color: 'red' } },
        pristine: false,
        dirty: true
      })
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'green' } });
    expect(api.getState()).to.deep.equal(
      getState({
        values: { favorite: { color: 'green' } },
        pristine: false,
        dirty: true
      })
    );
    api.reset();
    expect(api.getState()).to.deep.equal(
      getState({
        values: { favorite: { color: 'red' } },
        pristine: false,
        dirty: true
      })
    );
  });

  it('setValue should set a value', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    api.setValue('greeting', 'hello');
    expect(api.getState()).to.deep.equal(
      getState({ values: { greeting: 'hello' }, pristine: false, dirty: true })
    );
  });

  it('setValue should set a scoped value', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Scope scope="favorite">
          <Text field="color" />
        </Scope>
      </Form>
    );
    api.setValue('favorite.color', 'green');
    expect(api.getState()).to.deep.equal(
      getState({
        values: { favorite: { color: 'green' } },
        pristine: false,
        dirty: true
      })
    );
  });

  it('setError should set an error', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    api.setError('greeting', 'error');
    expect(api.getState().errors).to.deep.equal({ greeting: 'error' });
  });

  it('when an error is present the form should be invalid', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    api.setError('greeting', 'error');
    expect(api.getState().invalid).to.equal(true);
  });

  it('when an error is present then goes away form should be valid', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    api.setError('greeting', 'error');
    expect(api.getState().invalid).to.equal(true);
    api.setError('greeting', undefined);
    expect(api.getState().invalid).to.equal(false);
  });

  it('setFormError should set form error', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
      </Form>
    );
    api.setFormError('error');
    expect(api.getState().error).to.equal('error');
  });

  it('when a form error is present the form should be invalid', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    api.setFormError('error');
    expect(api.getState().invalid).to.equal(true);
  });

  it('when an error is present then goes away form should be valid', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>);
    api.setFormError('error');
    expect(api.getState().invalid).to.equal(true);
    api.setFormError(undefined);
    expect(api.getState().invalid).to.equal(false);
  });

  it('setTouched should set touched', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
      </Form>
    );
    api.setTouched('greeting', true);
    expect(api.getState().touched).to.deep.equal({ greeting: true });
  });

  it('fieldExists should return true if field exists', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
      </Form>
    );
    expect(api.fieldExists('greeting')).to.equal(true);
  });

  it('fieldExists should return true if field exists', () => {
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text field="greeting" />
      </Form>
    );
    expect(api.fieldExists('foobar')).to.equal(false);
  });

  // SET WARNINGG AND SUCCESS TESTS

  it('should call onSubmit function with values when the form is submitted via api submit function', () => {
    let api;
    const spy = sandbox.spy();
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi}>
        <Text field="greeting" />
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    api.submitForm();
    expect(spy.called).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' });
  });

  // TODO figure out how to test enter button submission!
  it.skip('should call onSubmit function with values when the form is submitted via enter key', () => {
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form onSubmit={spy}>
        <Text field="greeting" />
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });

    wrapper.find('input').simulate('keypress', { key: 'Enter' });

    expect(spy.called).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' });
  });

  it('should give child function access to formApi', () => {
    const spy = sandbox.spy();
    mount(<Form>{spy}</Form>);
    expect(spy.called).to.equal(true);
    checkFormApi(spy.args[0][0].formApi);
    checkFormState(spy.args[0][0].formState);
  });

  it('should give render function access to formApi and formState', () => {
    const spy = sandbox.spy();
    mount(<Form render={spy} />);
    expect(spy.called).to.equal(true);
    checkFormApi(spy.args[0][0].formApi);
    checkFormState(spy.args[0][0].formState);
  });

  it('should give component passed in access to formApi as prop', () => {
    const Inputs = () => null;
    const comp = mount(<Form component={Inputs} />);
    const inputs = comp.find('Inputs');
    expect(inputs.length).to.equal(1);
    checkFormApi(inputs.props().formApi);
  });

  it('errors should update when input is changed', () => {
    const validate = value => (value === 'Foo' ? 'ooo thats no good' : null);
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="name" validateOnChange validate={validate} />
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({});
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });

    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good'
    });
  });

  it('errors should update when input is blured', () => {
    const validate = value => (value === 'Foo' ? 'ooo thats no good' : null);
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="name" validateOnBlur validate={validate} />
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({});
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });
    input.simulate('blur');

    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good'
    });
  });

  it('errors should update when validate is called manually', () => {
    const validate = value => (value === 'Foo' ? 'ooo thats no good' : null);
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="name" validate={validate} />
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({});
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });
    expect(api.getState().errors).to.deep.equal({});
    api.validate();
    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good'
    });
  });

  it('errors should update when validate is called manually on a specific field', () => {
    const validate = value => (value === 'Foo' ? 'ooo thats no good' : null);
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="name" validate={validate} />
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({});
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });
    expect(api.getState().errors).to.deep.equal({});
    api.validateField('name');
    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good'
    });
  });

  it('errors should update when initial value is set and validateOnMount is passed in', () => {
    const validate = value => (value === 'Foo' ? 'ooo thats no good' : null);
    let api;
    const setApi = param => {
      api = param;
    };
    mount(
      <Form getApi={setApi}>
        <Text
          field="name"
          validateOnMount
          validate={validate}
          initialValue="Foo"
        />
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good'
    });
  });

  it('errors should update when input is changed after changing validation function prop', () => {
    const validate1 = value => (value === 'Foo' ? 'ooo thats no good' : null);
    const validate2 = value => (value === 'Foo' ? 'new validation!' : null);
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        {({ formState }) => (
          <Text
            field="name"
            validateOnChange
            validate={formState.values.name === 'Foo' ? validate2 : validate1}
          />
        )}
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({});
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });
    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good'
    });
    input.simulate('change', { target: { value: 'Foo' } });
    expect(api.getState().errors).to.deep.equal({
      name: 'new validation!'
    });
  });

  it('errors should update when input is changed and notify is passed to a field', () => {
    const validate = value =>
      value === 'Foo' ? 'ooo thats no good' : undefined;
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text
          field="name"
          validateOnChange
          validate={validate}
          notify={['confirmName']}
        />
        <Text field="confirmName" validate={validate} />
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({});
    wrapper
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'Foo' } });
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'Foo' } });

    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good',
      confirmName: 'ooo thats no good'
    });
  });

  it('errors should update when input is changed and notify is NOT passed to a field', () => {
    const validate = value =>
      value === 'Foo' ? 'ooo thats no good' : undefined;
    let api;
    const setApi = param => {
      api = param;
    };
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="name" validateOnChange validate={validate} />
        <Text field="confirmName" validate={validate} />
      </Form>
    );
    expect(api.getState().errors).to.deep.equal({});
    wrapper
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'Foo' } });
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'Foo' } });

    expect(api.getState().errors).to.deep.equal({
      name: 'ooo thats no good'
    });
  });

  // WARNINGG AND SUCCESS TESTS ^^
});
