/* Add to Calendar Event Generator (.ics Download & Google Calendar Link) */

class CalendarExporter {
  constructor() {
    this.eventData = {
      title: 'Mustafa & Salma Wedding & Henna Night',
      description: 'Together with their families, Mustafa & Salma invite you to celebrate their engagement & wedding.',
      location: 'Al Yashmak Hall, Al Arish, North Sinai',
      startDate: '20260815T200000',
      endDate: '20260815T230000'
    };
    this.init();
  }

  init() {
    const btn = document.getElementById('add-to-calendar-btn');
    if (btn) {
      btn.addEventListener('click', () => this.downloadIcs());
    }
  }

  downloadIcs() {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mustafa & Salma Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${this.eventData.title}`,
      `DESCRIPTION:${this.eventData.description}`,
      `LOCATION:${this.eventData.location}`,
      `DTSTART:${this.eventData.startDate}`,
      `DTEND:${this.eventData.endDate}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mustafa_and_Salma_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.rsvpManager) {
      window.rsvpManager.showToast('Event added to Calendar!');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CalendarExporter();
});
