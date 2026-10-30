// Every lesson on the site, in menu order. A lesson with no `url` shows as "coming soon".
// `newIn` marks a lesson for a newer app version: it gets the NEW starburst wherever it's linked.
// The menu, the Previous/Next buttons, and the "I did this" ticks all read this one list.
window.LESSONS = [
  { group: 'Start here', id: 'backup', title: 'Back up to Drive', url: 'backup.html', minutes: 3 },
  { group: 'Start here', id: 'calendar', title: 'Load the calendar', url: 'calendar.html', minutes: 5 },
  { group: 'Start here', id: 'bells', title: 'Set the bell schedule', url: 'bells.html', minutes: 3 },
  { group: 'Start here', id: 'roster', title: 'Your roster', url: 'roster.html', minutes: 10 },
  { group: 'Start here', id: 'add', title: 'Add your students', url: 'add-students.html', minutes: 5 },
  { group: 'Start here', id: 'firstday', title: 'Log your first day', url: 'first-day.html', minutes: 5 },
  { group: 'Every day', id: 'absences', title: 'Absences & whole-class codes', url: 'absences.html', minutes: 3 },
  { group: 'Every day', id: 'catchup', title: 'Catch up on missed days', url: 'catchup.html', minutes: 3 },
  { group: 'Paste & report', id: 'paste', title: 'Paste a week into the log', url: 'paste.html', minutes: 3 },
  { group: 'Paste & report', id: 'minutes', title: 'Minutes report', url: 'minutes.html', minutes: 4 },
  { group: 'Paste & report', id: 'accreport', title: 'Accommodations report', url: 'acc-report.html', minutes: 4 },
  { group: 'Students', id: 'twoclasses', title: 'A student in two classes', url: 'two-classes.html', minutes: 5 },
  { group: 'Students', id: 'leaves', title: 'Leaves or comes back', url: 'leaves.html', minutes: 4 },
  { group: 'When the IEP changes', id: 'ard', title: 'Enter an ARD change', url: 'ard.html', minutes: 4 },
  { group: 'When the IEP changes', id: 'acc', title: 'Edit accommodations', url: 'accommodations.html', minutes: 3 },
  { group: 'Goals', id: 'goalsetup', title: 'Set up goal tracking', url: 'goal-setup.html', minutes: 6 },
  { group: 'Goals', id: 'goalproject', title: 'Goal Setup project: make it, then import', url: 'goal-project.html', minutes: 8 },
  { group: 'Goals', id: 'goalwriter', title: 'Write a measurable goal', url: 'goal-writer.html', minutes: 5 },
  { group: 'Goals', id: 'progress', title: 'Goal progress: record, report, fix', url: 'progress.html', minutes: 6 },
  { group: 'Lessons & leveled guides', id: 'lessons', title: 'Import a lesson, organize it by unit', url: 'import-lesson.html', minutes: 8 },
  { group: 'Lessons & leveled guides', id: 'builder', title: 'Set up the Leveled Guide Builder', url: 'builder.html', minutes: 10 },
  { group: 'Lessons & leveled guides', id: 'guidesetup', title: 'Leveled guides', url: 'guides-setup.html', minutes: 7 },
  { group: 'Keep it safe', id: 'update', title: 'Update to a new version', url: 'update.html', minutes: 5 },
  { group: 'Keep it safe', id: 'restore', title: 'Restore a backup', url: 'restore.html', minutes: 4 },
  { group: 'Keep it safe', id: 'august', title: 'August year-end', url: 'august.html', minutes: 10 },
];

// NEW badges disappear, in this browser, once their lesson is ticked "I did this" (and come back
// if it's unticked). A badge belongs to the link it sits in or right after; on a lesson page the
// badge at the top belongs to that lesson.
window.refreshNewBadges = function (currentId) {
  const lessons = window.LESSONS || [];
  const isDone = (id) => { try { return localStorage.getItem('done:' + id) === '1'; } catch (e) { return false; } };
  const idFor = (b) => {
    if (b.closest('.crumbs')) return currentId || null;
    const a = b.closest('a') || (b.previousElementSibling && b.previousElementSibling.tagName === 'A' ? b.previousElementSibling : null);
    if (!a) return null;
    const file = (a.getAttribute('href') || '').split('?')[0].split('#')[0].split('/').pop();
    const l = lessons.find((x) => x.url === file);
    return l ? l.id : null;
  };
  for (const b of document.querySelectorAll('.newburst')) {
    const id = idFor(b);
    b.hidden = !!id && isDone(id);
  }
};
