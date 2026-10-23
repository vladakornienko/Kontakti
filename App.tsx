import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as Contacts from 'expo-contacts/legacy';

type ContactItem = {
  id: string;
  name: string;
  phoneNumber: string;
};

export default function App() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function getContacts() {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Warning', 'Permission is required.');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
        ],
      });

      const contactList: ContactItem[] = data
        .filter(contact => contact.name)
        .map(contact => ({
          id: contact.id,
          name: contact.name ?? '',
          phoneNumber: contact.phoneNumbers?.[0]?.number ?? '',
        }))
        .sort((a, b) => a.name.localeCompare(b.name));


      setContacts(contactList);
    } catch {
      Alert.alert('Error', 'Could not load contacts.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Get Contacts"
        onPress={getContacts} />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (

        <FlatList style={styles.list} data={contacts} keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.contact}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.phoneNumber}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Press Get Contacts to loaded your contacts.
            </Text>
          }
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    padding: 20,
  },
  list: {
    marginTop: 20,
    width: '100%',
  },

  contact: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  empty: {
    marginTop: 20,
    textAlign: 'center'
  },
  loading: {
    marginTop: 20,
  },
});

