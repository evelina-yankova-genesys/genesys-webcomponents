export const html = `
<gux-accordion>
  <gux-accordion-section>
    <h2 slot="header">First Section</h2>
    <div slot="content">Sample Content</div>
  </gux-accordion-section>
  <gux-accordion-section arrow-position="beside-text">
    <h2 slot="header">Second Section</h2>
    <div slot="content">Sample Content</div>
  </gux-accordion-section>
  <gux-accordion-section disabled>
    <h2 slot="header">Third Section</h2>
    <h3 slot="subheading">This is the subheading</h3>
    <div slot="content">Sample Content</div>
  </gux-accordion-section>
  <gux-accordion-section>
    <h2 slot="header">Fourth Section</h2>
    <h3 slot="subheading">This is the subheading</h3>
    <gux-icon
      slot="icon"
      icon-name="add-user"
      screenreader-text="add John Smith to contact list"
    ></gux-icon>
    <div slot="content">Sample Content</div>
  </gux-accordion-section>
  <gux-accordion-section reverse-headings="true">
    <h2 slot="header">Fourth Section</h2>
    <h3 slot="subheading">This is the subheading</h3>
    <gux-icon
      slot="icon"
      icon-name="add-user"
      screenreader-text="add John Smith to contact list"
    ></gux-icon>
    <div slot="content">Sample Content</div>
  </gux-accordion-section>
</gux-accordion>
`;
