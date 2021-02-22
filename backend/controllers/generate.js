const Orders = require('../models/Orders');
const Companies  = require('../models/Companies');
const Customers = require('../models/Customers');
const Users = require('../models/Users');
const errorHandler = require('../utils/errorHandler');

const moment = require('moment');
const fs = require('fs');
const path = require('path');
const async = require('async');
const html_to_pdf = require('html-pdf-node');

module.exports.generateAgreement = async (req, res) => {
    try {

        let customer, company;
        // Получаем информацию о клиенте или компании
        if (req.body.customerId) {
            customer = await Customers.findById(req.body.customerId);
        }

        if (req.body.companyId) {
            company = await Companies.findById(req.body.companyId);
        }

        req.body.assignedUserId = req.body.assignedUserId ? req.body.assignedUserId : req.user.id;

        const user = await Users.findById(req.body.assignedUserId);

        // Стороны договора
        let client;

        if (customer) {
            client = `${customer.surname} ${customer.name} ${customer.patronym}, именуемый (-ая) в дальнейшем "Заказчик"`;
        }

        // 5fc9ef8451bfb25220441b94
        if (company) {
            client = `${company.title}, именуемое в дальнейшем "Заказчик"`;
        }

        const servicesList = req.body.servicesList.map((service, i) => {
            return `
                <tr>
                  <td>${i + 1}</td>
                  <td>${service.title}</td>
                  <td>${service.quantity}</td>
                  <td>${service.amount}</td>
                  <td>${+service.quantity * +service.amount}</td>
                </tr>
            `;
        });
        const orderTotal = req.body.servicesList.reduce((acc, val) => {
            return acc + val.quantity * val.amount
        }, 0);

        // Генерация pdf

        let options = {
            format: 'A4',
            margin: {
                top: 20,
                bottom: 20,
                right: 10,
                left: 30
            },
            path: path.join(__dirname, '../uploads', 'documents', `${req.body.title}.pdf`)
        };
        let file = [{
            content: `
                <!DOCTYPE html>
                <html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
    <style>
      p {
        text-align: justify;
      }
      h4 {
        font-weight: normal;
        text-align: center;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th,
      td {
        border: 1px solid #000;
        text-align: center;
        padding: 10px;
      }
      .left-col {
        border: none;
        text-align: left;
      }
      .right-col {
        border: none;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <img
      src="http://promax42.ru/wp-content/themes/promax/images/new_logo.png"
      style="display: block; text-align: center;"
      alt="logo"
    />
    <h2 style="text-align: center;">Договор возмездного оказания услуг № 24</h2>
    <span style="display: block; text-align: right;">${moment().format('DD.MM.YYYY')} г.</span>
    <p style="margin-bottom: 20px;">
      ${client}, c одной
      стороны и ООО "ПРОМАКС", именуемое в дальнейшем "Исполнитель", с другой
      стороны, именуемые в дальнейшем "Стороны", заключили настоящий Договор о
      нижеследующем:
    </p>
    <h4>1.Предмет договора</h4>
    <p>
      1.1. По договору возмездного оказания услуг Исполнитель обязуется по
      заданию Заказчика оказать услуги, указанные в п.1.2 настоящего Договора, а
      Заказчик обязуется принять и оплатить эти услуги.
    </p>
    <p>
      1.2. Исполнитель обязуется оказать следующие услуги:
    </p>
    <table>
      <thead>
        <tr>
          <th style="width: 10%;">№ п./п.</th>
          <th style="width: 37%;">Наименование услуги</th>
          <th style="width: 17%;">Количество</th>
          <th style="width: 18%;">Стоимость, руб.</th>
          <th style="width: 18%;">Сумма, руб.</th>
        </tr>
      </thead>
      <tbody>
        ${servicesList.join('')}
        <tr>
          <td colspan="4" style="font-weight: 700;">Итого:</td>
          <td style="font-weight: 700;">${orderTotal}</td>
        </tr>
      </tbody>
    </table>
    <span style="display: block; margin-top: 10px; text-align: center;"
      >Услуги считаются оказанными после подписания сторонами акта оказанных
      услуг</span
    >
    <h4>2. Сумма договора и порядок расчетов</h4>
    <p>
      2.1 Сумма настоящего Договора составляет ${orderTotal} рублей, включая НДС ${orderTotal}
      рублей.
    </p>
    <p>
      2.2 Оплата по настоящему Договору производится в течение 2 рабочих дней с
      момента подписания настоящего Договора
    </p>
    <h4>3. Права и обязанности сторон</h4>
    <p>3.1. Исполнитель обязан:</p>
    <p>3.1.1. Оказать услуги надлежащего качества.</p>
    <p>
      3.1.2. Оказать услуги в полном объеме в срок, указанный в п. 8.1
      настоящего Договора.
    </p>
    <p>
      3.1.3. Безвозмездно исправить по требованию Заказчика все выявленные
      недостатки, если в процессе оказания услуг Исполнитель допустил
      отступление от условий Договора, ухудшившее качество работы, в течение 10
      рабочих дней.
    </p>
    <p>3.1.4. Выполнить работу лично или с привлечением третьих лиц.</p>
    <p>3.2. Заказчик обязан:</p>
    <p>
      3.2.1. Оплатить услуги по цене, указанной в п. 2.1. настоящего Договора.
    </p>
    <p>3.3. Заказчик имеет право:</p>
    <p>
      3.4.1. Во всякое время проверять ход и качество работы, выполняемой
      Исполнителем, не вмешиваясь в его деятельность.
    </p>
    <p>
      3.4.2. Отказаться от исполнения Договора в любое время до подписания акта
      оказанных услуг, уплатив Исполнителю часть установленной цены
      пропорционально части оказанных услуг, выполненной до получения извещения
      об отказе Заказчика от исполнения договора.
    </p>
    <h4>4. Ответственность сторон</h4>
    <p>
      4.1. За нарушение срока оказания услуг, указанного в п.8.1 настоящего
      Договора, Исполнитель, при наличии письменной претензии, уплачивает
      Заказчику пеню в размере 2% от суммы Договора за каждый день просрочки.
    </p>
    <p>
      4.2. При несоблюдении предусмотренных настоящим Договором сроков расчета
      за оказанные услуги Заказчик, при наличии письменной претензии, уплачивает
      Исполнителю пеню в размере 5% не перечисленной в срок суммы за каждый день
      просрочки.
    </p>
    <p style="margin-bottom: 50px;">
      4.3. Уплата неустойки не освобождает Исполнителя от выполнения лежащих на
      нем обязательств или устранения нарушений.
    </p>
    <table>
      <tbody>
        <tr>
          <td class="left-col">Менеджер по продажам ООО "Промакс"</td>
          <td class="right-col">Заказчик</td>
        </tr>
        <tr>
          <td class="left-col">${user.surname} ${user.name.slice(0, 1)}. ${user.patronym.slice(0, 1)}.</td>
          <td class="right-col">${customer.surname} ${customer.name.slice(0, 1)}. ${customer.patronym.slice(0, 1)}.</td>
        </tr>
        <tr>
          <td class="left-col">____________________________</td>
          <td class="right-col">____________________________</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
            `,
            name: `${req.body.title}.pdf`
        }];

        await html_to_pdf.generatePdfs(file, options).then(output => {
            console.log("PDF Buffer:-", output[0].name);
        });

        return res.status(200).json({path: path.join('uploads', 'documents', `${req.body.title}.pdf`)});

    } catch (err) {
        return errorHandler(res, err);
    }
}
