import { convertIssue } from '#server/issue';
import { preRenderHook } from '#server/preRenderHook.static';
import { Db, ObjectId } from 'mongodb';

export const issueLoader :preRenderHook = async ({ request }) => {
  const { db }:{db:Db} = request;

  try {
    const id = new ObjectId(request.params.id);

    const issue = await db.collection('issues').findOne({ _id: id });
    // data conversion
    let newIssue;
    if (issue !== null) {
      newIssue = convertIssue(issue);
      newIssue._id = issue?._id.toString();
      if (!newIssue.completionDate) {
        // if missing then null to be `Nothing`
        newIssue.completionDate = null;
      }
    }
    // done
    return { data: newIssue };
  } catch (err) {
    console.log('error', err);
  }
};
