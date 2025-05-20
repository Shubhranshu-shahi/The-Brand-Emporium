const axios = require("axios");

const sendInvoice = async (req, res) => {
  try {
    const { invoiceId, customerPhone, customerName } = req.body.params;

    console.log(
      "WhatsApp API request body:",
      invoiceId,
      customerPhone,
      customerName
    );
    console.log("WhatsApp API request params:", req.params);
    const url = `https://graph.facebook.com/v22.0/${process.env.WHATS_APP_PHONE}/messages`;

    const body = {
      messaging_product: "whatsapp",
      to: `91${customerPhone}`,
      type: "template",
      template: {
        name: "purchase_receipt_3",
        language: {
          code: "en_US",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: customerName,
              },
              {
                type: "text",
                text: invoiceId,
              },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: 0,
            parameters: [
              {
                type: "text",
                text: `${invoiceId}`,
              },
            ],
          },
        ],
      },
    };

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${process.env.WHATS_APP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("WhatsApp API error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

const sendStockUpdate = async (req, res) => {
  try {
    const { brands, off } = req.body.WastocksData.data;
    const { selectedRows } = req.body.WastocksData;

    console.log("WhatsApp API request body:", brands, off, selectedRows);

    const url = `https://graph.facebook.com/v22.0/${process.env.WHATS_APP_PHONE}/messages`;

    const results = await Promise.all(
      selectedRows.map(async (row) => {
        try {
          const body = {
            messaging_product: "whatsapp",
            to: `91${row.phone}`,
            type: "template",
            template: {
              name: "new_stock_update",
              language: {
                code: "en",
              },
              components: [
                {
                  type: "header",
                  parameters: [
                    {
                      type: "image",
                      image: {
                        link: "https://thebrandemporium.vercel.app/assets/logo-KHLaBX17.jpeg",
                      },
                    },
                  ],
                },
                ,
                {
                  type: "body",
                  parameters: [
                    { type: "text", text: off },
                    { type: "text", text: brands },
                  ],
                },
              ],
            },
          };

          const response = await axios.post(url, body, {
            headers: {
              Authorization: `Bearer ${process.env.WHATS_APP_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          });

          return {
            phone: row.phone,
            status: "sent",
            data: response.data,
          };
        } catch (err) {
          console.error(
            `Failed to send to ${row.phone}:`,
            err.response?.data || err.message
          );
          return {
            phone: row.phone,
            status: "failed",
            error: err.response?.data || err.message,
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      message: "Stock update messages processed.",
      results,
    });
  } catch (error) {
    console.error(
      "WhatsApp API general error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  sendInvoice,
  sendStockUpdate,
};
