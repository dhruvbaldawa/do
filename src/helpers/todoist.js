import moment from 'moment';

export function isOverdue(task) {
  return task.due && moment(task.due.date).isBefore(moment.now());
}

export function hasDue(task) {
  console.log(task);
}
