const Orders = require('../models/Orders');
const Companies  = require('../models/Companies');
const Customers = require('../models/Customers');
const Users = require('../models/Users');
const errorHandler = require('../utils/errorHandler');

const officegen = require('officegen');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const async = require('async');

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

        const user = await Users.findById(req.body.assignedUserId);

        // Папка для сохранения документа
        const outDir = path.join(__dirname, '../uploads', 'documents');

        // Создаем документ
        let docx = officegen({
            type: 'docx',
            title: req.body.title,
            pageMargins: {
                top: 1300,
                bottom: 1300,
                left: 1000,
                right: 1000
            }
        });

        docx.on('error', err => console.log(err));

        // Лого
        let logo = docx.createP({
            align: 'center'
        });
        logo.addImage(path.resolve(__dirname, '../uploads/logo-png.png'));

        logo = docx.createP();
        logo.addText('');

        // Заголовок
        let header = docx.createP({
            align: 'center'
        });

        header.addText('Договор возмездного оказания услуг № 24', {
            font_face: 'Times New Roman',
            font_size: 12
        });

        let date = docx.createP({
            align: 'right'
        });

        date.addText(`${moment().format('DD.MM.YYYY')} г.`, {
            font_face: 'Times New Roman',
            font_size: 12
        });

        // Стороны договора
        let client;

        if (customer) {
            client = `${customer.surname} ${customer.name} ${customer.patronym} именуемый (-ая) в дальнейшем "Заказчик"`;
        }

        // 5fc9ef8451bfb25220441b94
        if (company) {
            client = `${company.title} именуемое в дальнейшем "Заказчик"`;
        }

        let text = docx.createP({
            align: 'justify'
        });
        text.addText('');
        text.addText(`${client}, c одной стороны и ООО "ПРОМАКС", именуемое в дальнейшем "Исполнитель", с другой стороны, именуемые в дальнейшем "Стороны", заключили настоящий Договор о нижеследующем:`, {
            font_face: 'Times New Roman',
            font_size: 12
        });

        // 1й пункт договора
        let one = docx.createP({
            align: 'justify'
        });
        one.addText('');
        one = docx.createP({align: 'center'});
        one.addText('1. Предмет договора', {font_face: 'Times New Roman', font_size: 12});
        one.addText('');
        one = docx.createP({align: 'justify'});
        one.addText('1.1. По договору возмездного оказания услуг Исполнитель обязуется по заданию Заказчика оказать услуги, указанные в п.1.2 настоящего Договора, а Заказчик обязуется принять и оплатить эти услуги.', {font_face: 'Times New Roman', font_size: 12});
        one.addText('');
        one = docx.createP({align: 'justify'});
        one.addText('1.2. Исполнитель обязуется оказать следующие услуги:', {font_face: 'Times New Roman', font_size: 12});
        one.addText('');

        // Таблица услуг

        const servicesList = req.body.servicesList.map((service, i) => {
           return [i + 1, `${service.title}`, `${service.quantity}`, `${service.amount}`, +service.quantity * service.amount];
        });
        const orderTotal = servicesList.reduce((acc, val) => acc + val[4], 0);

        let table = [
          [{
              val: "№ п./п.",
              opts: {
                  b:true,
                  spacingBefore: 120,
                  spacingAfter: 120,
                  spacingLine: 240,
                  spacingLineRule: 'atLeast',
                  shd: {
                      fill: "7F7F7F",
                      themeFill: "text1",
                      "themeFillTint": "80"
                  },
                  fontFamily: "Times New Roman"
              }
          },{
              val: "Наименование услуги",
              opts: {
                  b:true,
                  align: "center",
                  vAlign: "center",
                  shd: {
                      fill: "cccccc",
                      themeFill: "text1",
                      "themeFillTint": "80"
                  }
              }
          },{
              val: "Количество",
              opts: {
                  align: "center",
                  vAlign: "center",
                  b: true,
                  shd: {
                      fill: "cccccc",
                      themeFill: "text1",
                      "themeFillTint": "80"
                  }
              }
          },{
              val: "Стоимость, руб.",
              opts: {
                  align: "center",
                  vAlign: "center",
                  b: true,
                  shd: {
                      fill: "cccccc",
                      themeFill: "text1",
                      "themeFillTint": "80"
                  }
              }
          },{
              val: "Сумма, руб.",
              opts: {
                  align: "center",
                  vAlign: "center",
                  b: true,
                  shd: {
                      fill: "cccccc",
                      themeFill: "text1",
                      "themeFillTint": "80"
                  }
              }
          }], ...servicesList,
            ['', 'Итого:', '', '', orderTotal]
          /*[1, 'Услуга 1', 2, 2000, 4000],
          [2, 'Услуга 2', 3, 3500, 10500]*/
        ];

        let tableStyle = {
            tableSize: 14,
            tableColor: "ada",
            tableAlign: "center",
            tableFontFamily: "Times New Roman",
            spacingBefor: 120, // default is 100
            spacingAfter: 120, // default is 100
            spacingLine: 240, // default is 240
            spacingLineRule: 'atLeast', // default is atLeast
            indent: 100, // table indent, default is 0
            fixedLayout: true, // default is false
            borders: true, // default is false. if true, default border size is 4
            borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
            columns: [{ width: 1000 }, { width: 3660 }, { width: 1689 }, { width: 1760 }, { width: 1760 }], // Table logical columns
        }

        docx.createTable(table, tableStyle);

        one = docx.createP({align: 'center'});
        one.addText('');
        one.addText('Услуги считаются оказанными после подписания сторонами акта оказанных услуг', {align: 'center', font_face: 'Times New Roman', font_size: 12});

        // 2й пункт договора
        let two = docx.createP({align: 'center'});
        two.addText('2. Сумма договора и порядок расчетов', {font_face: 'Times New Roman', font_size: 12});
        two = docx.createP({align: 'justify'});
        two.addText(`2.1 Сумма настоящего Договора составляет ${orderTotal} рублей, включая НДС ${orderTotal} рублей.`, {font_face: 'Times New Roman', font_size: 12});
        two = docx.createP({align: 'justify'});
        two.addText('2.2 Оплата по настоящему Договору производится в течение 2 рабочих дней с момента подписания настоящего Договора', {font_face: 'Times New Roman', font_size: 12});

        // 3й пункт договора
        let three = docx.createP({align: 'center'});
        three.addText('3. Права и обязанности сторон', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText(`3.1. Исполнитель обязан:`, {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.1.1. Оказать услуги надлежащего качества.', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.1.2. Оказать услуги в полном объеме в срок, указанный в п. 8.1 настоящего Договора.', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.1.3. Безвозмездно исправить по требованию Заказчика все выявленные недостатки, если в процессе оказания услуг Исполнитель допустил отступление от условий Договора, ухудшившее качество работы, в течение 10 рабочих дней.', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.1.4. Выполнить работу лично или с привлечением третьих лиц.', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.2. Заказчик обязан:', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.2.1. Оплатить услуги по цене, указанной в п. 2.1. настоящего Договора.', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.3. Заказчик имеет право:', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.4.1. Во всякое время проверять ход и качество работы, выполняемой Исполнителем, не вмешиваясь в его деятельность.', {font_face: 'Times New Roman', font_size: 12});
        three = docx.createP({align: 'justify'});
        three.addText('3.4.2. Отказаться от исполнения Договора в любое время до подписания акта оказанных услуг, уплатив Исполнителю часть установленной цены пропорционально части оказанных услуг, выполненной до получения извещения об отказе Заказчика от исполнения договора.', {font_face: 'Times New Roman', font_size: 12});

        // 4й пункт договора
        let four = docx.createP({align: 'center'});
        four.addText('4. Ответственность сторон', {font_face: 'Times New Roman', font_size: 12});
        four = docx.createP({align: 'justify'});
        four.addText('4.1. За нарушение срока оказания услуг, указанного в п.8.1 настоящего Договора, Исполнитель, при наличии письменной претензии, уплачивает Заказчику пеню в размере 2% от суммы Договора за каждый день просрочки.', {font_face: 'Times New Roman', font_size: 12});
        four = docx.createP({align: 'justify'});
        four.addText('4.2. При несоблюдении предусмотренных настоящим Договором сроков расчета за оказанные услуги Заказчик, при наличии письменной претензии, уплачивает Исполнителю пеню в размере 5% не перечисленной в срок суммы за каждый день просрочки.', {font_face: 'Times New Roman', font_size: 12});
        four = docx.createP({align: 'justify'});
        four.addText('4.3. Уплата неустойки не освобождает Исполнителя от выполнения лежащих на нем обязательств или устранения нарушений.', {font_face: 'Times New Roman', font_size: 12});
        four = docx.createP();
        four = docx.createP();

        // Подписи сторон
        table = [
            [
                {
                    val: "",
                    /*opts: {
                        b:true,
                        spacingBefore: 120,
                        align: "left",
                        spacingAfter: 120,
                        spacingLine: 240,
                        spacingLineRule: 'atLeast',
                        shd: {
                            fill: "FFFFFF",
                            themeFill: "text1",
                            "themeFillTint": "80"
                        }
                    }*/
                },
                {
                    val: "",
                    /*opts: {
                        b:true,
                        align: "right",
                        shd: {
                            fill: "FFFFFF",
                            themeFill: "text1",
                            "themeFillTint": "80"
                        }
                    }*/
                }
            ],
            ['Менеджер по продажам ООО "Промакс"', 'Заказчик'],
            [`${user.surname} ${user.name.slice(0, 1)}. ${user.patronym.slice(0, 1)}.`, `${customer.surname} ${customer.name.slice(0, 1)}. ${customer.patronym.slice(0, 1)}.`],
            ['__________________________', '__________________________']
        ];
        tableStyle = {
            tableSize: 24,
            tableFontFamily: "Times New Roman",
            spacingBefor: 120, // default is 100
            spacingAfter: 120, // default is 100
            spacingLine: 240, // default is 240
            spacingLineRule: 'atLeast', // default is atLeast
            indent: 100, // table indent, default is 0
            fixedLayout: true, // default is false
            //borders: true, // default is false. if true, default border size is 4
            //borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
            columns: [{ width: 4935 }, { width: 4935 }], // Table logical columns
        }
        docx.createTable(table, tableStyle);

        // Генерация документа
        let out = fs.createWriteStream(path.join(outDir, `${docx.options.title}.docx`));

        out.on('error', err => console.log(err));

        async.parallel([
            done => {
                out.on('close', () => {
                    console.log('Документ успешно создан.');
                    done(null);
                });
                docx.generate(out);
            }
        ],
            err => {
                if (err) {
                   console.log('error', err);
                }
            }
        );

        return res.status(200).json({path: path.join('uploads', 'documents', `${docx.options.title}.docx`)});

    } catch (err) {
        return errorHandler(res, err);
    }
}
