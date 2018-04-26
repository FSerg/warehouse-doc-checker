import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Form, Input, Message } from 'semantic-ui-react';

import TimeAgo from 'react-time-ago';
import jsTimeAgo from 'javascript-time-ago';
import ru from 'javascript-time-ago/locale/ru';

import { doCheck, resetCheck } from '../actions/checkActions';
import { getDateStr, getDate } from '../utils/Utils';

import AdditionalInfo from './AdditionalInfo';

jsTimeAgo.locale(ru);

class MainPage extends Component {
  state = {
    barcode: ''
  };

  componentDidMount() {
    this.barcodeInput.focus();
  }

  handleChange = (e, d) => {
    this.setState({ barcode: d.value });
  };

  handleSubmit = () => {
    if (this.state.barcode === '') {
      this.props.resetCheck();
    } else {
      this.props.doCheck(this.state.barcode);
      this.setState({ barcode: '' });
    }
  };

  renderError = () => {
    if (this.props.error) {
      return (
        <Message negative>
          <Message.Header>Ошибка</Message.Header>
          <p>{this.props.error}</p>
        </Message>
      );
    }
    return null;
  };

  renderAnswer = () => {
    const { result } = this.props.answer;
    if (this.props.answer.status === 'ok') {
      return (
        <Message size="massive" positive>
          <Message.Header>ВСЕ ОК</Message.Header>
          <p>
            Документ: {result.last_answer.numDok} от {result.last_answer.date}
          </p>
          <p>Сумма: {result.last_answer.sumtotal}</p>
        </Message>
      );
    }

    if (this.props.answer.status === 'finded') {
      return (
        <Message size="massive" warning>
          <Message.Header>ДОКУМЕНТ УЖЕ СКАНИРОВАЛСЯ!</Message.Header>
          <p>
            Документ: {result.last_answer.numDok} от {result.last_answer.date}
          </p>
          <p>Сумма: {result.last_answer.sumtotal}</p>
          Последняя проверка: {getDateStr(result.updatedAt)}
          <br />
          (<TimeAgo locale="ru-RU">{getDate(result.updatedAt)}</TimeAgo>)
        </Message>
      );
    }

    if (this.props.answer.status === 'fail') {
      return (
        <Message size="massive" negative>
          <Message.Header>НАКЛАДНАЯ НЕ НАЙДЕНА!</Message.Header>
          <p>
            ВНИМАНИЕ! Накладная не найдена в программе. Возможно, вас пытаются
            обмануть. Пригласите администратора для выяснения ситуации.
          </p>
        </Message>
      );
    }

    return null;
  };

  renderAdditionalInfo = () => {
    if (!this.props.answer.result) {
      return null;
    }
    const { last_answer } = this.props.answer.result;
    if (!last_answer) {
      return null;
    }
    if (!last_answer.list) {
      return null;
    }
    return <AdditionalInfo doc={last_answer} />;
  };

  render() {
    return (
      <div>
        <Container text textAlign="center" style={{ padding: '2em 0em' }}>
          <Header as="h3" style={{ fontSize: '2em' }}>
            Считайте штрих-код складской накладной
          </Header>
          <p style={{ fontSize: '1.25em', fontWeight: 'normal' }}>
            (при сканировании обязательно должен быть звуковой сигнал от
            сканера)
          </p>

          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Input
                ref={input => {
                  this.barcodeInput = input;
                }}
                size="massive"
                icon="search"
                fluid
                placeholder="штрих-код..."
                loading={this.props.isLoading}
                value={this.state.barcode}
                onChange={this.handleChange}
              />
            </Form.Field>
          </Form>
          {this.renderError()}
          {this.renderAnswer()}
        </Container>
        {this.renderAdditionalInfo()}
      </div>
    );
  }
}

MainPage.propTypes = {
  answer: PropTypes.object,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  doCheck: PropTypes.func.isRequired,
  resetCheck: PropTypes.func.isRequired
};

MainPage.defaultProps = {
  answer: {},
  error: '',
  isLoading: false
};

const mapStateToProps = state => {
  return {
    answer: state.checkStore.answer,
    isLoading: state.checkStore.isLoading,
    error: state.checkStore.error
  };
};

export default connect(mapStateToProps, { doCheck, resetCheck })(MainPage);
