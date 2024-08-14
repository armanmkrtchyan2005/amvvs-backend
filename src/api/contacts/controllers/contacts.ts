/**
 * A set of functions called "actions" for `quote`
 */

interface ContactsBody {
  name: string;
  email: string;
  phone: string;
  services: string;
  message: string;
  rot: string;
}

export default {
  applyContacts: async (ctx, next) => {
    try {
      const { name, email, phone, message } = ctx.request.body as ContactsBody;
      let files = ctx.request.files.files || [];

      if (files.length == 1) {
        files = [files];
      }

      const attachments = files.map((file) => {
        return { filename: file.name, contentType: file.type, path: file.path };
      }, []);

      let servicesHtml = "";
      let total = 0;

      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: "armanmkrtchyan440@gmail.com",
          subject: "Contacts",
          text: "Contacts",
          html: `<div>
          <h2>Contacts data</h2>
          <div>
            <h3>Name: ${name}</h3>
            <h3>Email: <a href="mailto:${email}">${email}</a></h3>
            <h3>Phone: <a href="tel:${phone}">${phone}</a></h3>
            <div>
              <h3>Message</h3>
              <p>${message}</p>
            </div>
          </div>
        </div>`,
          attachments,
        });

      ctx.body = ctx;
    } catch (err) {
      console.log(err);

      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
