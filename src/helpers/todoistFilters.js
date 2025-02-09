import moment from 'moment';
import _ from 'lodash';
import arrayToTree from 'array-to-tree';

/** Todoist Filters API
 * filter has API:
 *  filter(data): returns a function which takes a (task) as an argument
 *    the inner function returns a boolean
 */

export function isOverdue(/* data */) {
  return (task) => {
    return Boolean(task.due && moment(task.due.date).isBefore(moment.now()));
  };
}

export function isToday(/* data */) {
  return (task) => {
    return Boolean(task.due && moment(task.due.date).isSame(moment.now(), 'day'));
  };
}

export function overdueOrToday(/* data */) {
  return (task) => {
    return isOverdue()(task) || isToday()(task);
  };
}

export function inProject(name) {
  return (data) => {
    const projectsTree = arrayToTree(_.values(data.projects));
    const testProject = _.find(projectsTree, (project) => {
      return project.name.match(new RegExp(name, 'g'));
    });
    console.log('foo');

    return (task) => {
      return task.project_id === testProject.id;
    };
  };
}
