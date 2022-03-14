// import {useState,} from 'react';
const { useState, } = React;

export default function IssueAdd(props) {
    const [owner, setOwner] = useState('');
    const [title, setTitle] = useState('');
    /* TODO? : function need to be defined only once */
    function handleSubmit(event) {
        props.onSubmit({
            title: title, owner: owner,
            status: 'New',
            created: new Date(),
        });
        // clear state.
        setOwner('');
        setTitle('');
        event.preventDefault();
    }
    function handleChange(setter) {
        return event => setter(event.target.value);
    }

    return (
        <div>
            <form name='issueAdd' onSubmit={handleSubmit}>
                <input placeholder="Owner" value={owner} onChange={handleChange(setOwner)}></input>
                <input placeholder="Title" value={title} onChange={handleChange(setTitle)}></input>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}