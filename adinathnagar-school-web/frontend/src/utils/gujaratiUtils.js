const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

const daysWords = [
  "", "પહેલી", "બીજી", "ત્રીજી", "ચોથી", "પાંચમી", "છઠ્ઠી", "સાતમી", "આઠમી", "નવમી", "દસમી", 
  "અગિયારમી", "બારમી", "તેરમી", "ચૌદમી", "પંદરમી", "સોળમી", "સત્તરમી", "અઢારમી", "ઓગણીસમી", "વીસમી", 
  "એકવીસમી", "બાવીસમી", "તેવીસમી", "ચોવીસમી", "પચ્ચીસમી", "છવીસમી", "સત્તાવીસમી", "અઠ્ઠાવીસમી", 
  "ઓગણત્રીસમી", "ત્રીસમી", "એકત્રીસમી"
];

const monthsWords = [
  "જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", 
  "જુલાઈ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"
];

const numberWords1to30 = [
  "", "એક", "બે", "ત્રણ", "ચાર", "પાંચ", "છ", "સાત", "આઠ", "નવ", "દસ", 
  "અગિયાર", "બાર", "તેર", "ચૌદ", "પંદર", "સોળ", "સત્તર", "અઢાર", "ઓગણીસ", "વીસ", 
  "એકવીસ", "બાવીસ", "તેવીસ", "ચોવીસ", "પચ્ચીસ", "છવીસ", "સત્તાવીસ", "અઠ્ઠાવીસ", "ઓગણત્રીસ", "ત્રીસ"
];

const extendedNumberWords = {
  31: 'એકત્રીસ', 32: 'બત્રીસ', 33: 'તેત્રીસ', 34: 'ચોત્રીસ', 35: 'પાંત્રીસ', 36: 'છત્રીસ', 37: 'સાડત્રીસ', 38: 'આડત્રીસ', 39: 'ઓગણચાલીસ', 40: 'ચાલીસ',
  41: 'એકતાલીસ', 42: 'બેતાલીસ', 43: 'ત્રેતાલીસ', 44: 'ચુમ્માલીસ', 45: 'પિસ્તાલીસ', 46: 'છેતાલીસ', 47: 'સુડતાલીસ', 48: 'અડતાલીસ', 49: 'ઓગણપચાસ', 50: 'પચાસ',
  51: 'એકાવન', 52: 'બાવન', 53: 'ત્રેપન', 54: 'ચોપન', 55: 'પંચાવન', 56: 'છપ્પન', 57: 'સત્તાવન', 58: 'અઠ્ઠાવન', 59: 'ઓગણસાઠ', 60: 'સાઠ',
  61: 'એકસઠ', 62: 'બાસઠ', 63: 'ત્રેસઠ', 64: 'ચોસઠ', 65: 'પાંસઠ', 66: 'છાસઠ', 67: 'સડસઠ', 68: 'અડસઠ', 69: 'અગણોસિત્તેર', 70: 'સિત્તેર',
  71: 'એકોતેર', 72: 'બિંતેર', 73: 'તોતેર', 74: 'ચુમોતેર', 75: 'પંચોતેર', 76: 'છોતેર', 77: 'સિત્યોતેર', 78: 'ઈચ્છોતેર', 79: 'ઓગણાએંસી', 80: 'એંસી',
  81: 'એક્યાસી', 82: 'બ્યાસી', 83: 'ત્યાસી', 84: 'ચોર્યાસી', 85: 'પંચાસી', 86: 'છ્યાસી', 87: 'સિત્યાસી', 88: 'ઈઠ્યાસી', 89: 'નેવ્યાસી', 90: 'નેવું',
  91: 'એકાણું', 92: 'બાણું', 93: 'ત્રાણું', 94: 'ચોરાણું', 95: 'પંચાણું', 96: 'છન્નું', 97: 'સત્તાણું', 98: 'અઠ્ઠાણું', 99: 'નવાણું'
};

export const toGujaratiNumbers = (input) => {
  if (input === null || input === undefined) return '';
  return input.toString().split('').map(char => {
    const isNum = !isNaN(parseInt(char, 10));
    return isNum ? gujaratiDigits[parseInt(char, 10)] : char;
  }).join('');
};

export const getGujaratiNumberWord = (n) => {
  if (n <= 30) {
    if (n >= 0 && n < numberWords1to30.length) {
      return numberWords1to30[n];
    }
  } else {
    if (extendedNumberWords[n]) {
      return extendedNumberWords[n];
    }
  }
  return n.toString();
};

export const formatDateGujarati = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return toGujaratiNumbers(`${day}/${month}/${year}`);
  } catch (e) {
    return dateStr;
  }
};

export const dateToGujaratiWords = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();

    const monthWord = monthsWords[month] || '';
    const dayWord = daysWords[day] || '';

    let yearWord = '';
    if (year === 2000) {
      yearWord = 'બે હજાર';
    } else {
      const lastTwo = year % 100;
      yearWord = 'બે હજાર ' + getGujaratiNumberWord(lastTwo);
    }

    return `${dayWord} ${monthWord} ${yearWord.trim()}`;
  } catch (e) {
    return dateStr;
  }
};
