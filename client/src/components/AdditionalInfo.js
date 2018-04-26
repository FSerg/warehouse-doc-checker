import React from 'react';
import { Table, Label } from 'semantic-ui-react';

const AdditionalInfo = ({ doc }) => (
  <Table celled striped>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell colSpan="5">
          <Label style={{ float: 'right' }} size="large" color="teal">
            {doc.sumsection} р.
          </Label>
          {doc.section}
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {doc.list.map(item => {
        return (
          <Table.Row key={item.codeNom}>
            <Table.Cell collapsing>{item.codeNom}</Table.Cell>
            <Table.Cell>{item.nom}</Table.Cell>
            <Table.Cell collapsing textAlign="center">
              {item.kol}
            </Table.Cell>
            <Table.Cell collapsing textAlign="right">
              {item.price} р.
            </Table.Cell>
            <Table.Cell collapsing textAlign="right">
              {item.sum} р.
            </Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table>
);

export default AdditionalInfo;
