

function IssueSearchNavItem() {
  return (
    <AsyncSelect
      loadOptions={issuesToOptions(loadOptions)}
      onChange={(newValue, actionMeta) => {
        console.log(newValue, actionMeta);
        if (actionMeta.action === 'select-option') {
          setSearchText(newValue.value);
        }
      }}
    />
  );
}
