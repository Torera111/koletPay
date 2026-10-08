import { StoreData, dateISO } from './types';
const payment = (id: string, amount: number, agoDays=0) => ({ id, amount, date:dateISO(-agoDays), method:'Bank transfer (demo)' });
export const DEMO_DATA: StoreData = {
  business:{name:"Iyanu's Prints",email:'iyanu@example.com',phone:'+234 803 000 1000'},
  customers:[
    {id:'c-sarah',name:'Sarah James',phone:'+234 803 456 7890',email:'sarah.james@gmail.com',location:'Lekki, Lagos',contact:'Phone',joinedAt:'2026-07-12',notes:'Regular customer; likes custom mugs for special occasions.',project:'Birthday gift package',projectDetails:'20 customized mugs and gift wrapping; deliver to Lekki.',projectDue:dateISO(8)},
    {id:'c-tolu',name:'Tolu Adebayo',phone:'+234 704 234 5678',email:'tolu@example.com',location:'Yaba, Lagos',contact:'Email',joinedAt:'2026-06-10',notes:'Prefers early delivery.',project:'Staff T-shirts',projectDetails:'10 printed shirts in different sizes.',projectDue:dateISO(6)},
    {id:'c-david',name:'David Okafor',phone:'+234 809 876 5432',email:'david@example.com',location:'Ikeja, Lagos',contact:'Phone',joinedAt:'2026-08-22',notes:'Follow up on outstanding notebook order.',project:'Branded notebooks',projectDetails:'30 branded notebooks for conference.',projectDue:dateISO(-3)},
    {id:'c-ada',name:'Ada Designs',phone:'+234 812 345 6789',email:'ada@example.com',location:'Surulere, Lagos',contact:'Email',joinedAt:'2026-05-03',notes:'Repeat gift-box orders.',project:'Gift box set',projectDetails:'Customized thank-you gift boxes.',projectDue:dateISO(-8)},
    {id:'c-bola',name:'Bola Adeyemi',phone:'+234 703 987 6543',email:'bola@example.com',location:'Maryland, Lagos',contact:'Phone',joinedAt:'2026-09-18',notes:'Interested in discounts for bulk orders.',project:'Branded mugs',projectDetails:'20 personalized mugs.',projectDue:dateISO(-1)}
  ],
  products:[
    {id:'p-shirts',name:'Custom T-Shirts',kind:'Product',price:8000,description:'Personalised shirt printing'},
    {id:'p-mugs',name:'Custom Mugs',kind:'Product',price:7500,description:'Photo and text printing on mugs'},
    {id:'p-notebooks',name:'Branded Notebooks',kind:'Product',price:4000,description:'A5 branded notebooks'},
    {id:'p-gifts',name:'Gift Box Set',kind:'Product',price:13000,description:'Personalised gift box'},
    {id:'p-design',name:'Artwork Design',kind:'Service',price:20000,description:'Custom print-ready artwork'}
  ],
  invoices:[
    {id:'INV-1005',customerId:'c-tolu',issuedAt:dateISO(-1),dueAt:dateISO(3),items:[{productId:'p-shirts',description:'Custom T-Shirts',quantity:10,unitPrice:8000}],payments:[payment('pay-tolu',80000,0)],notes:'Staff uniform shirts'},
    {id:'INV-1004',customerId:'c-sarah',issuedAt:dateISO(-2),dueAt:dateISO(8),items:[{productId:'p-mugs',description:'Custom Mugs',quantity:20,unitPrice:7500}],payments:[],notes:'Birthday gift package'},
    {id:'INV-1003',customerId:'c-david',issuedAt:dateISO(-12),dueAt:dateISO(-3),items:[{productId:'p-notebooks',description:'Branded Notebooks',quantity:30,unitPrice:4000}],payments:[],notes:'Conference order'},
    {id:'INV-1002',customerId:'c-ada',issuedAt:dateISO(-10),dueAt:dateISO(-5),items:[{productId:'p-gifts',description:'Gift Box Set',quantity:5,unitPrice:13000}],payments:[payment('pay-ada',65000,5)],notes:''},
    {id:'INV-1001',customerId:'c-bola',issuedAt:dateISO(-20),dueAt:dateISO(-2),items:[{productId:'p-mugs',description:'Custom Mugs',quantity:20,unitPrice:5000}],payments:[payment('pay-bola',100000,2)],notes:'Repeat order'},
    {id:'INV-1000',customerId:'c-sarah',issuedAt:dateISO(-15),dueAt:dateISO(-10),items:[{productId:'p-design',description:'Artwork Design',quantity:4,unitPrice:20000}],payments:[payment('pay-sarah',80000,10)],notes:'Print-ready artworks'}
  ]
};
