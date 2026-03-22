/**
 * English translation strings
 * Mirror structure of he.ts
 */
import type { Translations } from './he';

export const en: Translations = {
  appName: 'Parents as Partners',
  tagline: 'Respectful co-parenting for the sake of our children',

  nav: {
    home:       'Home',
    hurt:       'You Hurt Me',
    boundaries: 'Boundaries',
  },

  switchToEnglish: 'English',
  switchToHebrew:  'עברית',

  home: {
    pictureOfTheDay: 'Picture of the Day',
    sayingOfTheDay:  'Saying of the Day',
    by:              'by',
  },

  hurt: {
    pageTitle:         'You Hurt Me',
    pageSubtitle:      'A safe space to express hurt in a respectful way',
    dotCount:          'dots',
    entryFormTitle:    'Add Entry',
    writerLabel:       'Who is writing?',
    targetLabel:       'About whom?',
    textPlaceholder:   'I was hurt when you said...',
    submitButton:      'Save',
    submitting:        'Saving...',
    entriesTitle:      'Entries',
    noEntries:         'No entries yet.',
    modalWrittenBy:    'Written by',
    modalAbout:        'About',
    modalDate:         'Date',
    modalClose:        'Close',
    charCount:         'chars',
    selectPerson:      'Select...',
    validationText:    'Please enter some text.',
    validationWriter:  'Please select who is writing.',
    validationTarget:  'Please select who this is about.',
    samePersonError:   'You cannot write about yourself.',
    successMessage:    'Entry saved!',
    errorMessage:      'Error saving. Please try again.',
  },

  boundaries: {
    pageTitle:         'Boundaries',
    kingTitle:         'The King Said...',
    textPlaceholder:   'This message was passed to the children without my consent',
    submitButton:      'Post',
    submitting:        'Saving...',
    messagesTitle:     'Messages',
    noMessages:        'No messages yet.',
    writerLabel:       'Who is writing?',
    selectPerson:      'Select...',
    validationText:    'Please enter some text.',
    validationWriter:  'Please select who is writing.',
    successMessage:    'Message saved!',
    errorMessage:      'Error saving. Please try again.',
    charCount:         'chars',
  },

  calendar: {
    title:    'Weekly Calendar',
    today:    'Today',
    days:     ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },

  loading: 'Loading...',
  error:   'Failed to load',
  retry:   'Try again',
  close:   'Close',
};
