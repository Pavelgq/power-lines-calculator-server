const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

const generateDocx = (data, pathString) => {
  const content = fs.readFileSync(
    path.resolve(__dirname, pathString),
    "binary"
  );

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: false,
    linebreaks: true,
  });

  doc.render(data);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  fs.writeFileSync(path.resolve(__dirname, "../../output.docx"), buf);
};

module.exports = generateDocx;

// const data = {
//   trH: 20,
//   trTransportShort: "ат", // 'жт',
//   trTransportLong: "автомобильной дорогой", // 'железной дорогой'
//   trKTransport: 20, // 28,
//   nPho: 2, //Удельный вес грунта
//   tr1Qt: 1,
//   tr1Qg: 2,
//   trModul: 4,
//   tr1Qsum: 6,
//   tr1SN: 1,
//   trGrunt: "песоком, уплотненным вручную",
//   tr1SNcheck: 32, //Выбранная кольцевая жесткость
//   ktN: 1,
//   ktDvDekv: 1.5,
//   ktD: 1,
//   ktDmin: 170, //То, что посчитали
//   ktDcheck: 200, //То что выбрали
//   ktDoutMin: 199, //Возможно заменить предыдущий
//   tr1D: 200,
//   tr1E: 1,

//   gnbHmax: 1,
//   gnb1QrMin: 39,
//   gnb1QtMin: 41,
//   gnb1QsumMin: 80,
//   gnb1SNmin: 15,
//   gnb1SN1check: 20,
//   gnbD: 89,
//   gnbN: 1,
//   gnbDvDekv: 1.5,
//   gnb1E: 12,
//   gnbDoutMin: 140, //Расчитанный
//   gnbDcheck: 200, //Выбранный
//   gnbNp: 3,
//   gnb1Dekv: 211,
//   gnbKdekv: 2.2, //Коэффициент добавить (зависит от числа кабелей в пучке)
//   gnbGrunt: "грунт щебнистый",
//   gnbKgrunt: 1.5,
//   gnbL: 144,
//   gnbKext: 1.2,
//   gnbFfact: 21, //по формуле?
//   gnbF: 38,
//   setFFmax: 0.5, //с листа настройки
//   gnb1Fmax: 160, //с листа расчет
//   gnbFmax: 38,
//   gnb1SN: 23,
//   gnb1SN2check: 32,
//   gnb1D: 200,
//   gnb1Drsh: 500,
//   gnb1Hr: 123,
//   gnb1QrMax: 1,
//   nPho: 2,
//   gnbHmax: 20,
//   gnb1P: 20,
//   gnb1SNmax: 12,
//   gnb1SN3check: 48,
//   gnb1SNres: 48,
//   gnb1Dcalc: 200,
// };
//generateDocx(Object.freeze(data));
