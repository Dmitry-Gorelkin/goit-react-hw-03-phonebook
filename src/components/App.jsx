import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Container } from './Container/Container';
import { Section } from './Section/Section';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { Notification } from './Notification/Notification';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  handleInput = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = ({ name, number }) => {
    this.setState(prevState => {
      return {
        contacts: [...prevState.contacts, { id: nanoid(), name, number }],
      };
    });
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');

    try {
      if (contacts) {
        this.setState({
          contacts: JSON.parse(contacts),
        });
        return;
      }

      this.setState({
        contacts: [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;

    if (prevState.contacts !== contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  deleteContact = id => {
    this.setState(prevState => {
      return { contacts: prevState.contacts.filter(item => item.id !== id) };
    });
  };

  render() {
    const { contacts, filter } = this.state;
    const normalizeFilter = filter.toLowerCase();
    const visibleContactList = contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter)
    );

    return (
      <Container>
        <Section title="phonebook">
          <ContactForm onSubmit={this.handleSubmit} contactList={contacts} />
        </Section>
        <Section title="contacts">
          <Filter onChange={this.handleInput} value={filter} />
          {contacts.length !== 0 ? (
            <ContactList
              contact={visibleContactList}
              onDelete={this.deleteContact}
            />
          ) : (
            <Notification message="no contacts" />
          )}
        </Section>
      </Container>
    );
  }
}
