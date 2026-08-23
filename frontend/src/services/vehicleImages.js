// Exact make+model matches (highest priority)
const modelImages = {
  // Toyota
  'toyota camry':   'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  'toyota rav4':    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
  'toyota corolla': 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=900&q=80',
  'toyota highlander': 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',
  'toyota tacoma':  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  'toyota supra':   'https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&w=900&q=80',

  // BMW
  'bmw x5':         'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
  'bmw 3 series':   'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=900&q=80',
  'bmw 5 series':   'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=900&q=80',
  'bmw m3':         'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80',
  'bmw m5':         'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=900&q=80',
  'bmw x3':         'https://images.unsplash.com/photo-1617814076229-8c8e3e5e5e5e?auto=format&fit=crop&w=900&q=80',
  'bmw i4':         'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80',

  // Mercedes
  'mercedes c-class':  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
  'mercedes e-class':  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80',
  'mercedes s-class':  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
  'mercedes gle':      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
  'mercedes amg gt':   'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
  'mercedes a-class':  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',

  // Audi
  'audi a4':        'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=900&q=80',
  'audi a6':        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=900&q=80',
  'audi q5':        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=80',
  'audi q7':        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=80',
  'audi r8':        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
  'audi tt':        'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=900&q=80',

  // Honda
  'honda civic':    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',
  'honda accord':   'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=900&q=80',
  'honda cr-v':     'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',
  'honda pilot':    'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',

  // Ford
  'ford mustang':   'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  'ford f-150':     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  'ford explorer':  'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',
  'ford bronco':    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',

  // Tesla
  'tesla model 3':  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
  'tesla model s':  'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=900&q=80',
  'tesla model x':  'https://images.unsplash.com/photo-1566473965997-3de9c817e938?auto=format&fit=crop&w=900&q=80',
  'tesla model y':  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80',
  'tesla cybertruck': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80',

  // Porsche
  'porsche 911':    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  'porsche cayenne':'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=900&q=80',
  'porsche panamera':'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  'porsche macan':  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=900&q=80',

  // Chevrolet
  'chevrolet camaro':  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  'chevrolet corvette':'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  'chevrolet silverado':'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',

  // Lamborghini
  'lamborghini huracan': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
  'lamborghini urus':    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',

  // Ferrari
  'ferrari 488':    'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=900&q=80',
  'ferrari f8':     'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=900&q=80',
  'ferrari roma':   'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=900&q=80',

  // Range Rover / Land Rover
  'range rover sport':  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
  'land rover defender':'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',

  // Hyundai
  'hyundai tucson': 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',
  'hyundai sonata': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  'hyundai elantra':'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=900&q=80',

  // Nissan
  'nissan altima':  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  'nissan gt-r':    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
  'nissan rogue':   'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
}

// Brand-level fallback images (used when exact model not found)
const brandImages = {
  toyota:      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  bmw:         'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
  mercedes:    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
  audi:        'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=900&q=80',
  honda:       'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',
  ford:        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  tesla:       'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
  porsche:     'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  chevrolet:   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  lamborghini: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
  ferrari:     'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=900&q=80',
  'range rover':'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
  'land rover': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  hyundai:     'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',
  nissan:      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  volkswagen:  'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=900&q=80',
  volvo:       'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
  jeep:        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  kia:         'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=900&q=80',
  mazda:       'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=900&q=80',
  subaru:      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
  lexus:       'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
  infiniti:    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80',
  cadillac:    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  dodge:       'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  ram:         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  buick:       'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  acura:       'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=900&q=80',
}

// Generic car fallback — only used if brand is completely unknown
export const fallbackImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'

/**
 * Returns the best matching image for a vehicle.
 * Priority: exact make+model → brand-level → generic fallback
 */
export function getVehicleImage(make = '', model = '') {
  const makeKey = make.trim().toLowerCase()
  const fullKey = `${makeKey} ${model.trim().toLowerCase()}`

  // 1. Exact make + model match
  if (modelImages[fullKey]) return modelImages[fullKey]

  // 2. Partial model match within same brand (e.g. "BMW 3 Series GT" → "bmw 3 series")
  const partialMatch = Object.entries(modelImages).find(
    ([key]) => key.startsWith(makeKey) && fullKey.includes(key.split(' ').slice(1).join(' '))
  )
  if (partialMatch) return partialMatch[1]

  // 3. Brand-level fallback
  if (brandImages[makeKey]) return brandImages[makeKey]

  // 4. Partial brand match (e.g. "Mercedes-Benz" → "mercedes")
  const brandMatch = Object.entries(brandImages).find(
    ([brand]) => makeKey.includes(brand) || brand.includes(makeKey)
  )
  if (brandMatch) return brandMatch[1]

  // 5. Generic fallback
  return fallbackImage
}
