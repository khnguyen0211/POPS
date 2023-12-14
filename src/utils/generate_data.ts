import { faker } from '@faker-js/faker'
import { Brand, Category, PaymentMethod, PaymentStatus, ProductStatus } from '~/constants/enums'
import { Customer } from '~/models/schemas/customers.schema'
import { Product } from '~/models/schemas/products.schema'
import { Voucher } from '~/models/schemas/vouchers.schema'
import databaseService from '~/services/database.service'
import { DateTime } from 'luxon'

export const productList: Product[] = [
  new Product({
    product_name: 'iPhone 15 Pro Max 256GB',
    description: 'This is iPhone 15 Pro Max 256GB',
    import_price: 3499,
    brand: Brand.Unknown,
    retail_price: 3699,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/9/14/638302786719525352_ip-15-pro-max-dd.jpg'
    ],
    barcode: '59402645',
    quantity: 14,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Samsung Galaxy S22 5G 128GB',
    description: 'This is Samsung Galaxy S22 5G 128GB',
    import_price: 1199,
    brand: Brand.Unknown,
    retail_price: 1399,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/3/31/638158962810512367_ss-galaxy-s22-dd-icon.jpg'
    ],
    barcode: '18196041',
    quantity: 20,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'OPPO Reno8 T 4G 256GB',
    description: 'This is OPPO Reno8 T 4G 256GB',
    import_price: 729,
    brand: Brand.Unknown,
    retail_price: 929,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/3/27/638155148198300095_oppo-reno8-t-4g-dd.jpg'
    ],
    barcode: '10040751',
    quantity: 5,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Honor X8A 8GB-128GB',
    description: 'This is Honor X8A 8GB-128GB',
    import_price: 399,
    brand: Brand.Unknown,
    retail_price: 599,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/6/30/638237370001190590_honor-x8-dd-docquyen.jpg'
    ],
    barcode: '87177816',
    quantity: 12,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Xiaomi Redmi Note 12 4GB-128GB',
    description: 'This is Xiaomi Redmi Note 12 4GB-128GB',
    import_price: 429,
    brand: Brand.Unknown,
    retail_price: 629,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/3/24/638152739283440892_xiaomi-redmi-note-12-dd-bh.jpg'
    ],
    barcode: '82862573',
    quantity: 5,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Samsung Galaxy A05s 128GB',
    description: 'This is Samsung Galaxy A05s 128GB',
    import_price: 399,
    brand: Brand.Unknown,
    retail_price: 599,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/10/4/638320081767757292_samsung-galaxy-a05s-dd-moi.jpg'
    ],
    barcode: '04750132',
    quantity: 12,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'OPPO Reno10 5G 256GB',
    description: 'This is OPPO Reno10 5G 256GB',
    import_price: 1049,
    brand: Brand.Unknown,
    retail_price: 1249,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/7/19/638253719455954445_oppo-reno10-5g-dd.jpg'
    ],
    barcode: '84318902',
    quantity: 15,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Samsung Galaxy Z Flip4 5G 128GB',
    description: 'This is Samsung Galaxy Z Flip4 5G 128GB',
    import_price: 1299,
    brand: Brand.Unknown,
    retail_price: 1499,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/2/28/638131739579610504_samsung-galaxy-z-flip4-tim-dd-tragop.jpg'
    ],
    barcode: '97943172',
    quantity: 19,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Samsung Galaxy A34 5G',
    description: 'This is Samsung Galaxy A34 5G',
    import_price: 699,
    brand: Brand.Unknown,
    retail_price: 899,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/7/5/638241722578403987_samsung-galaxy-a34-dd.jpg'
    ],
    barcode: '87028115',
    quantity: 15,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'realme C55 6GB-128GB',
    description: 'This is realme C55 6GB-128GB',
    import_price: 399,
    brand: Brand.Unknown,
    retail_price: 599,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/3/21/638150119693895777_realme-c55-dd.jpg'
    ],
    barcode: '75324238',
    quantity: 20,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'OPPO A58 6GB-128GB',
    description: 'This is OPPO A58 6GB-128GB',
    import_price: 459,
    brand: Brand.Unknown,
    retail_price: 659,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/8/2/638265802441511578_oppo-a58-dd.jpg'
    ],
    barcode: '67017626',
    quantity: 7,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Samsung Galaxy Z Flip5 5G 256GB',
    description: 'This is Samsung Galaxy Z Flip5 5G 256GB',
    import_price: 2199,
    brand: Brand.Unknown,
    retail_price: 2399,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/8/28/638288178412655978_samsung-galaxy-z-flip5-xanh-dd-tragop.jpg'
    ],
    barcode: '20186096',
    quantity: 3,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Xiaomi 13 Lite 8GB-128GB',
    description: 'This is Xiaomi 13 Lite 8GB-128GB',
    import_price: 799,
    brand: Brand.Unknown,
    retail_price: 999,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/3/24/638152728715036708_xiaomi-13-lite-dd-docquyen-bh.jpg'
    ],
    barcode: '70522285',
    quantity: 12,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'OPPO A55 4GB-64GB',
    description: 'This is OPPO A55 4GB-64GB',
    import_price: 339,
    brand: Brand.Unknown,
    retail_price: 539,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/10/15/637699137820447063_oppo-a55-dd.jpg'
    ],
    barcode: '59674089',
    quantity: 16,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'OPPO A17k 3GB-64GB',
    description: 'This is OPPO A17k 3GB-64GB',
    import_price: 299,
    brand: Brand.Unknown,
    retail_price: 499,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/12/20/638071502453762468_oppo-a17k-dd.jpg'
    ],
    barcode: '31712935',
    quantity: 1,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Samsung Galaxy A14 4G',
    description: 'This is Samsung Galaxy A14 4G',
    import_price: 339,
    brand: Brand.Unknown,
    retail_price: 539,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/6/8/638218311992000309_samsung-galaxy-a14-4g-dd.jpg'
    ],
    barcode: '11638268',
    quantity: 4,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Samsung Galaxy A04',
    description: 'This is Samsung Galaxy A04',
    import_price: 239,
    brand: Brand.Unknown,
    retail_price: 439,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/5/23/638204396768989147_samsung-galaxy-a04-dd.jpg'
    ],
    barcode: '42234710',
    quantity: 16,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Xiaomi Redmi Note 12 Pro 8GB-256GB',
    description: 'This is Xiaomi Redmi Note 12 Pro 8GB-256GB',
    import_price: 719,
    brand: Brand.Unknown,
    retail_price: 919,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/5/22/638203653824945690_xiaomi-redmi-note-12-pro-4g-dd-bh.jpg'
    ],
    barcode: '36987579',
    quantity: 12,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Xiaomi Redmi 12C 4GB - 64GB',
    description: 'This is Xiaomi Redmi 12C 4GB - 64GB',
    import_price: 244,
    brand: Brand.Unknown,
    retail_price: 444,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/3/8/638138646675090630_xiaomi-redmi-12c-dd.jpg'
    ],
    barcode: '69902530',
    quantity: 9,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Xiaomi Redmi 10A 3GB-64GB',
    description: 'This is Xiaomi Redmi 10A 3GB-64GB',
    import_price: 229,
    brand: Brand.Unknown,
    retail_price: 429,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/12/24/638074782811199183_xiaomi-redmi-10a-dd-bh-docquyen.jpg'
    ],
    barcode: '46200875',
    quantity: 1,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'realme C51 4GB-128GB',
    description: 'This is realme C51 4GB-128GB',
    import_price: 379,
    brand: Brand.Unknown,
    retail_price: 579,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/8/23/638283976760946791_realme-c51-dd.jpg'
    ],
    barcode: '25242036',
    quantity: 18,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Honor X6A 4GB-128GB',
    description: 'This is Honor X6A 4GB-128GB',
    import_price: 329,
    brand: Brand.Unknown,
    retail_price: 529,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/8/23/638284044993110103_hornor-x6a-dd.jpg'
    ],
    barcode: '18744540',
    quantity: 11,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Asus ROG Phone 7 16GB-512GB',
    description: 'This is Asus ROG Phone 7 16GB-512GB',
    import_price: 2399,
    brand: Brand.Unknown,
    retail_price: 2599,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/5/27/638208087528589069_asus-rog-phone-7-dd.jpg'
    ],
    barcode: '18597642',
    quantity: 11,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Asus ROG Phone 6 12GB-256GB',
    description: 'This is Asus ROG Phone 6 12GB-256GB',
    import_price: 1499,
    brand: Brand.Unknown,
    retail_price: 1699,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/7/26/637944507138520994_asus-rog-6-12gb-256gb-dd.jpg'
    ],
    barcode: '30684220',
    quantity: 20,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Nokia 5710 XpressAudio',
    description: 'This is Nokia 5710 XpressAudio',
    import_price: 159,
    brand: Brand.Unknown,
    retail_price: 359,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/10/18/638016907739748325_nokia-5710-xpressaudio-den-dd.jpg'
    ],
    barcode: '12663158',
    quantity: 9,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Vivo Y22s 8GB-128GB',
    description: 'This is Vivo Y22s 8GB-128GB',
    import_price: 439,
    brand: Brand.Unknown,
    retail_price: 639,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/9/637983398315589960_vivo-y22s-xanh-dd.jpg'
    ],
    barcode: '34220658',
    quantity: 3,
    status: ProductStatus.Available
  }),
  new Product({
    product_name: 'Vivo T1x 4GB-64GB',
    description: 'This is Vivo T1x 4GB-64GB',
    import_price: 359,
    brand: Brand.Unknown,
    retail_price: 559,
    category: Category.Phone,
    image_urls: [
      'https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/7/21/637939995401683559_vivo-t1x-xanh-dd.jpg'
    ],
    barcode: '86012848',
    quantity: 13,
    status: ProductStatus.Available
  })
].map((p) => {
  const price = randomNumber(500, 3000)
  return {
    ...p,
    import_price: price,
    retail_price: Math.ceil(price * 1.24),
    quantity: randomNumber(50, 200),
    brand: randomNumber(0, 8),
    category: randomNumber(0, 2)
  }
})

const faker_product = () => {
  const faker_products: Product[] = []
  for (let i = 0; i < 20; i++) {
    const product = new Product({
      product_name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      brand: Brand.Unknown,
      import_price: Number(faker.commerce.price()),
      retail_price: Number(faker.commerce.price()),
      category: Category.Phone,
      image_urls: [faker.image.urlPicsumPhotos()],
      barcode: '',
      quantity: 100,
      status: ProductStatus.Available,
      created_at: new Date(),
      updated_at: new Date()
    })
    faker_products.push(product)
  }

  return faker_products
}

const generateCustomerList = (): Customer[] => {
  const customer_list: Customer[] = []
  for (let i = 0; i < 20; i++) {
    const customer = new Customer({
      full_name: faker.person.fullName(),
      phone_number: generatePhoneNumber(),
      address: faker.location.streetAddress()
    })
    customer_list.push(customer)
  }
  return customer_list
}

const generatePhoneNumber = () => {
  const numbers = Array.from(Array(10), (_, i) => Math.floor(Math.random() * 10))
  let phoneNumber = '0' + numbers.slice(0, 3).join('') + '.'
  phoneNumber += numbers.slice(3, 6).join('') + '.'
  phoneNumber += numbers.slice(6, 9).join('')
  return phoneNumber
}

export const generateBillCode = async () => {
  const num = await databaseService.invoices.find({}).toArray()
  const created_bill = new Date()
  const year = created_bill.getFullYear()
  const last_number = num.length + 1
  let result = ''
  if (last_number > 0 && last_number < 10) {
    result = `${year}POS-INV00${last_number}`
  }
  result = `${year}POS-INV0${last_number}`
  return result
}

const generateVouchers = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const level_01: number[] = [10, 20, 50]
  const level_02: number[] = [70, 100, 150]
  const level_03: number[] = [200, 300, 500]

  const listCode: string[] = []
  const listVoucher: Voucher[] = []
  for (let i = 0; i < 100; i++) {
    let code = ''
    for (let j = 0; j < 6; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      code += characters.charAt(randomIndex)
    }
    listCode.push(code)
  }
  for (let i = 1; i <= 100; i++) {
    const randomIndex = Math.floor(Math.random() * 3)
    if (i <= 60) {
      const voucher = new Voucher({ code: listCode[i - 1], value: level_01[randomIndex] })
      listVoucher.push(voucher)
    } else if (i > 61 && i <= 90) {
      const voucher = new Voucher({ code: listCode[i - 1], value: level_02[randomIndex] })
      listVoucher.push(voucher)
    } else {
      const voucher = new Voucher({ code: listCode[i - 1], value: level_03[randomIndex] })
      listVoucher.push(voucher)
    }
  }
  return listVoucher
}

export const initialData = async () => {
  const product = await databaseService.products.findOne({})
  if (!product) {
    console.log('Importing products data...')
    await databaseService.products.insertMany(productList)
    console.log('DONE !')
  }

  const customer = await databaseService.customers.findOne({})
  if (!customer) {
    console.log('Importing customers data...')
    await databaseService.customers.insertMany(generateCustomerList())
    console.log('DONE !')
  }

  const voucher = await databaseService.vouchers.findOne({})
  if (!voucher) {
    console.log('Importing vouchers data...')
    await databaseService.vouchers.insertMany(generateVouchers())
    console.log('DONE !')
  }
}

export const generate_week = (increase?: boolean) => {
  const today = DateTime.now()

  const sevenDaysAgo = today.minus({ days: 6 })

  const days: string[] = []

  for (let i = today; i >= sevenDaysAgo; i = i.minus({ days: 1 })) {
    days.push(i.toISODate() as string)
  }
  if (increase) {
    days.reverse()
  }
  return days
}

export const generate_days = (from: string, to: string) => {
  const days: string[] = []
  const [from_year, from_moth, from_day] = from.split('-')
  const [to_year, to_moth, to_day] = to.split('-')
  const from_date = DateTime.utc(Number(from_year), Number(from_moth), Number(from_day))
  const to_date = DateTime.utc(Number(to_year), Number(to_moth), Number(to_day))
  for (let i = to_date; i >= from_date; i = i.minus({ days: 1 })) {
    days.push(i.toISODate() as string)
  }
  console.log(days)
  return days
  console.log(to_date.toString())
}

function randomNumber(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}
