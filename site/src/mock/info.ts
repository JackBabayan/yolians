// Fixture copy for FAQ, shipping rates, and legal pages. Delete this file when that copy comes from the backend.
import { phrase, type Phrase } from "../i18n"

export type Line = { q: Phrase; a: Phrase }
export type Group = { title: Phrase; items: Line[] }

export const groups: Group[] = [
  {
    title: phrase({ ru: "Заказ и доставка", en: "Orders and shipping" }),
    items: [
      {
        q: phrase({ ru: "Сколько ждать заказ?", en: "How long will it take to receive my order?" }),
        a: phrase({ ru: "Обычный курьер: 5-7 рабочих дней, бесплатно от $500. Экспресс: 2-3 дня, $25. Европа: 5-7 дней, €30. Северная Америка: 2-3 дня, $25. Остальной мир: 7-12 дней, $25. В Милане и Париже можно забрать в тот же день.", en: "Standard courier: 5-7 business days, free over $500. Express: 2-3 days, $25. Europe: 5-7 days, €30. North America: 2-3 days, $25. Rest of the world: 7-12 days, $25. Milan and Paris offer same-day pickup." }),
      },
      {
        q: phrase({ ru: "Можно изменить или отменить заказ?", en: "Can I modify or cancel my order once placed?" }),
        a: phrase({ ru: "Да, пока вещь не уехала из ателье. Напишите в контакты и укажите номер заказа.", en: "Yes, until it leaves the atelier. Write via contact and include the order number." }),
      },
      {
        q: phrase({ ru: "Доставляете за границу?", en: "Do you ship internationally?" }),
        a: phrase({ ru: "Да. За пределами Евросоюза пошлина считается в корзине, отдельно на таможне её доплачивать не нужно.", en: "Yes. Outside the European Union the duty is added in the cart, so it is not collected again at customs." }),
      },
    ],
  },
  {
    title: phrase({ ru: "Возврат и обмен", en: "Returns and exchanges" }),
    items: [
      {
        q: phrase({ ru: "Как устроен возврат?", en: "What is your return policy?" }),
        a: phrase({ ru: "14 дней, если вещь не носили и бирки на месте. Обратную доставку оплачиваем мы. Индивидуальный пошив не возвращаем, если крой уже начат.", en: "14 days if it is unworn and the tags are on. We pay the return shipping. Custom tailoring is not returned once cutting has started." }),
      },
      {
        q: phrase({ ru: "Как обменять размер?", en: "How do I exchange an item for a different size?" }),
        a: phrase({ ru: "Напишите в контакты с номером заказа. Если размера нет, сошьём отдельно.", en: "Write via contact with the order number. If the size is gone, we make it separately." }),
      },
    ],
  },
  {
    title: phrase({ ru: "Уход", en: "Product care" }),
    items: [
      {
        q: phrase({ ru: "Как хранить кожаную сумку?", en: "How should I store my leather bag?" }),
        a: phrase({ ru: "В пыльнике, вдали от солнца и батарей. Кожа должна оставаться сухой.", en: "In a dust bag, away from sun and heaters. Keep the leather dry." }),
      },
      {
        q: phrase({ ru: "Можно ли отремонтировать кеды?", en: "Are Yolians sneakers eligible for repair?" }),
        a: phrase({ ru: "Напишите в ателье и приложите фото. Скажем, берёмся ли за эту пару.", en: "Write to the atelier with photos. We will say whether we can repair that pair." }),
      },
    ],
  },
]

export const pages = {
  faq: {
    title: phrase({ ru: "Вопросы", en: "Frequently asked questions" }),
    intro: phrase({ ru: "Заказ, доставка, оплата, возврат и уход за кожей.", en: "Orders, delivery, payment, returns, and how to care for the leather." }),
  },
  returns: {
    title: phrase({ ru: "Возврат и обмен", en: "Returns and exchanges" }),
    intro: phrase({ ru: "14 дней на неношеную вещь. Обратную доставку оплачиваем мы.", en: "14 days for an unworn piece. We pay the return shipping." }),
  },
}


export const domestic = [
  {
    title: phrase({ ru: "Обычный курьер", en: "Standard courier" }),
    time: phrase({ ru: "5-7 рабочих дней", en: "5-7 business days" }),
    price: phrase({ ru: "Бесплатно от $500", en: "Free on orders over $500" }),
  },
  {
    title: phrase({ ru: "Экспресс", en: "Express courier" }),
    time: phrase({ ru: "2-3 рабочих дня", en: "2-3 business days" }),
    price: phrase({ ru: "$25", en: "$25" }),
  },
  {
    title: phrase({ ru: "Самовывоз", en: "Atelier pickup" }),
    time: phrase({ ru: "В тот же день, Милан и Париж", en: "Same day, Milan and Paris" }),
    price: phrase({ ru: "Бесплатно", en: "Complimentary" }),
  },
]

export const international = [
  {
    title: phrase({ ru: "Европа", en: "European Union" }),
    time: phrase({ ru: "5-7 рабочих дней", en: "5-7 business days" }),
    price: phrase({ ru: "€30", en: "€30" }),
  },
  {
    title: phrase({ ru: "Северная Америка", en: "North America" }),
    time: phrase({ ru: "2-3 рабочих дня", en: "2-3 business days" }),
    price: phrase({ ru: "$25", en: "$25" }),
  },
  {
    title: phrase({ ru: "Остальной мир", en: "Rest of the world" }),
    time: phrase({ ru: "7-12 рабочих дней", en: "7-12 business days" }),
    price: phrase({ ru: "$25", en: "$25" }),
  },
]


export const legal = {
  privacy: {
    title: phrase({ ru: "Политика конфиденциальности", en: "Privacy Policy" }),
    updated: phrase({ ru: "Обновлено: 24 октября 2026", en: "Last updated: October 24, 2026" }),
    blocks: [
      {
        title: phrase({ ru: "Какие данные мы собираем", en: "Information We Collect" }),
        body: phrase({ ru: "Чтобы выполнять индивидуальный пошив и отправлять заказы, мы собираем имя, адрес доставки, платёжные данные, адреса электронной почты и номера телефонов. Для клиентов с индивидуальными мерками точные размеры хранятся в личном профиле.", en: "To facilitate premium tailoring services and securely ship signature goods, we collect personal details including your name, shipping address, localized payment details, email addresses, and contact phone numbers. For clients utilizing custom sizing programs, we also record exact physical measurements safely within your private profile." }),
      },
      {
        title: phrase({ ru: "Как мы используем информацию", en: "How We Use Your Information" }),
        body: phrase({ ru: "Данные нужны, чтобы подтверждать оплату, организовывать доставку, сообщать о заказе и предлагать вещи по вашему профилю. Мерки и личные параметры не используются для сторонней рекламы.", en: "Collected details are utilized strictly to verify payment transactions, coordinate secured shipping networks, send updates regarding your order, and suggest tailored selections suited to your profile. We do not use your structural measurements or personal specifications for any external commercial applications." }),
      },
      {
        title: phrase({ ru: "Файлы cookie и отслеживание", en: "Cookies and Tracking" }),
        body: phrase({ ru: "Сайт использует технические cookie, чтобы сохранять корзину, язык и валюту. Они помогают работе магазина. Ограничить cookie можно в настройках браузера.", en: "Our digital atelier uses standard technical cookies to preserve your cart contents, language preferences, and localized currencies during navigation. These files help refine your online boutique experience. You can choose to restrict cookie tracking directly within your personal browser options." }),
      },
      {
        title: phrase({ ru: "Передача данных третьим лицам", en: "Data Sharing and Third Parties" }),
        body: phrase({ ru: "Yolians не продаёт и не передаёт ваши личные данные по лицензии. Они уходят только партнёрам, без которых покупку не завершить: платёжным системам, службам доставки и таможенным агентам.", en: "Yolians never distributes or licenses your private specifications. Your details are shared exclusively with trusted functional partners necessary to complete your purchase, including payment clearing gateways, certified courier networks, and localized custom-clearance agencies." }),
      },
      {
        title: phrase({ ru: "Защита данных", en: "Data Security" }),
        body: phrase({ ru: "Личные данные, мерки и платёжная информация передаются по защищённому соединению. Доступ к ним есть только у сотрудников ателье, которым он нужен для заказа. Хранилище защищено физически и технически.", en: "All personal details, sizing parameters, and payment vectors are processed with highly secure socket encryption protocols. Access to sensitive data is strictly limited to authorized atelier concierge representatives. We maintain physical and logical safeguards to protect our central storage systems." }),
      },
      {
        title: phrase({ ru: "Ваши права", en: "Your Rights" }),
        body: phrase({ ru: "Вы распоряжаетесь своими данными. Можно запросить, какие сведения мы храним, исправить их или удалить мерки и записи аккаунта. Для этого напишите в ателье.", en: "You hold full legal authority over your recorded data. You may request comprehensive transparency, complete modifications, or the absolute deletion of your custom measurement profiles and commercial account records at any time by contacting our client concierge department." }),
      },
      {
        title: phrase({ ru: "Конфиденциальность детей", en: "Children's Privacy" }),
        body: phrase({ ru: "Коллекции и сайт рассчитаны на взрослых клиентов. Мы не собираем данные людей младше 18 лет и удаляем такие записи, если они появились по ошибке.", en: "Our collections and digital platforms are curated exclusively for adult clients. We do not intentionally compile or maintain information from individuals under the age of 18, and will instantly purge any such records if mistakenly acquired." }),
      },
      {
        title: phrase({ ru: "Изменения политики", en: "Changes to This Policy" }),
        body: phrase({ ru: "Мы можем обновлять эту политику, если меняются требования закона или меры защиты. Новая редакция публикуется на этой странице с датой. Продолжая пользоваться сайтом, вы принимаете обновление.", en: "We reserve the right to refine our privacy practices to adapt to changing legal requirements or security upgrades. Any updates will be logged on this page with the updated revision date. Your continued visits indicate continuous acceptance." }),
      },
      {
        title: phrase({ ru: "Контакты", en: "Contact Us" }),
        body: phrase({ ru: "По вопросам этой политики, ваших данных или удаления записей напишите на privacy@yolians.com или позвоните в ателье.", en: "For questions regarding our privacy architecture, your recorded metrics, or data deletion queries, please contact our data safety division at privacy@yolians.com or reach out to our client concierge team via telephone." }),
      },
    ],
  },
  terms: {
    title: phrase({ ru: "Условия и положения", en: "Terms & Conditions" }),
    updated: phrase({ ru: "Обновлено: 24 октября 2026", en: "Last updated: October 24, 2026" }),
    blocks: [
      {
        title: phrase({ ru: "1. Общие условия", en: "1. General Terms" }),
        body: phrase({ ru: "Добро пожаловать в цифровое ателье Yolians. Пользуясь сайтом, защищёнными страницами или записью на пошив и консультацию, вы принимаете эти условия. Они распространяются на готовые вещи, кожаные изделия ручной работы, кеды и индивидуальные заказы под маркой Yolians.", en: "Welcome to the digital atelier of Yolians. By accessing our platform, secure web pages, or reserving booking services for custom tailoring and atelier consultations, you agree to comply with and be bound by the subsequent terms and conditions. These terms govern the purchase of all ready-to-wear items, handcrafted leather goods, custom sneakers, and bespoke commissions created under the Yolians label." }),
      },
      {
        title: phrase({ ru: "2. Заказы и цены", en: "2. Orders and Pricing" }),
        body: phrase({ ru: "Заказ принимается при наличии вещи. Цена фиксируется в момент покупки и показывается в валюте вашей локали. Мы стараемся сохранять точную цену и можем отменить заказ, если в ней или в карточке была ошибка. Индивидуальный пошив требует задатка, о котором договариваются на первой консультации.", en: "All acquisitions are subject to acceptance and availability. Prices are locked in at the precise moment of purchase and are displayed in global currencies based on localization. While we make every attempt to preserve exact pricing, we reserve the right to cancel orders arising from structural errors or pricing discrepancies. Bespoke commissions require a dedicated commitment deposit outlined during the initial consultation." }),
      },
      {
        title: phrase({ ru: "3. Доставка", en: "3. Shipping and Delivery" }),
        body: phrase({ ru: "Заказы отправляются надёжными службами, чтобы вещь приехала в сохранности. Каждая посылка застрахована от повреждений в пути. При вручении нужна подпись. Пошлины, местный НДС и таможенное оформление считаются при оформлении заказа, чтобы ввоз проходил без доплат более чем в 60 странах.", en: "We provide secure, premium carrier delivery global networks to deliver Yolians creations in pristine condition. Every parcel is thoroughly insured against structural transit damages. A physical signature is strictly verified at the destination address. Import duties, local VAT, and clearing customs are pre-calculated during the checkout process for seamless entry across over 60 countries." }),
      },
      {
        title: phrase({ ru: "4. Возврат", en: "4. Returns and Refunds" }),
        body: phrase({ ru: "Неношеную вещь можно вернуть бесплатно в течение 30 дней после прибытия посылки, если сохранены хлопковый пыльник и жёсткая упаковка. Вещь должна быть в исходном виде, защитная плёнка на подошве обуви не снята. Индивидуальный крой, гравировка и частные заказы сделаны только для вас и возврату или обмену не подлежат.", en: "We offer complimentary return services within 30 days of shipment arrival for all unused luxury items in their original protective cotton dust covers and hard packaging. Items must remain pristine with all footwear protective sole films intact. Custom-tailored coordinates, custom engraved accessories, and private commissions are tailored exclusively for you and are ineligible for return or exchange." }),
      },
      {
        title: phrase({ ru: "5. Интеллектуальная собственность", en: "5. Intellectual Property" }),
        body: phrase({ ru: "Изображения, модели, фурнитура, колодки, фирменные знаки и вёрстка на наших площадках принадлежат Yolians и защищены авторским правом и товарными знаками. Воспроизведение без разрешения запрещено.", en: "All visual elements, handcrafted designs, luxury hardware patterns, shoe sole molds, branding imagery, and typographic layouts published on our platforms are the exclusive property of Yolians and are protected globally under international copyright, trademark, and trade dress regulations. Any unauthorized reproduction is strictly prohibited." }),
      },
      {
        title: phrase({ ru: "6. Ограничение ответственности", en: "6. Limitation of Liability" }),
        body: phrase({ ru: "Yolians не отвечает за косвенные, случайные или последующие убытки от использования вещей или сайта. Ответственность по претензии из сделки ограничена ценой конкретной вещи, о которой идёт спор.", en: "Yolians shall not be held liable for any indirect, incidental, or consequential damages resulting from the use of our physical products or digital platforms. Our total liability for any claim arising from a commercial transaction is strictly capped at the purchase price of the specific luxury good in dispute." }),
      },
      {
        title: phrase({ ru: "7. Конфиденциальность", en: "7. Privacy" }),
        body: phrase({ ru: "Цифровая конфиденциальность для нас важна. Личные параметры, платёжные данные и мерки защищены современным SSL. Подробности о том, как мы храним и используем данные, есть в политике конфиденциальности.", en: "Your digital privacy is of maximum importance to our organization. Your personal specifications, payment details, and physical measurements are protected utilizing modern SSL cryptographic parameters. Please refer to our complete Privacy Policy, accessible below, to review details on how we safeguard, use, and store your parameters." }),
      },
      {
        title: phrase({ ru: "8. Применимое право", en: "8. Governing Law" }),
        body: phrase({ ru: "Эти условия, коммерческие правила и соглашения с клиентами регулируются правом Италии без учёта коллизионных норм. Споры по сделкам рассматриваются только судами Милана.", en: "These terms, commercial policies, and client agreements are governed by and construed in accordance with the laws of Italy, without giving effect to any principles of conflicts of law. Any legal proceedings arising from transactions shall be resolved exclusively within the state courts of Milan." }),
      },
    ],
  },
}

