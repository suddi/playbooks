publish-%: $@
	@FILENAME="$(@:publish-%=%)"; \
	ansible-playbook plays/npm_publish.yml --extra-vars "package_name=$$FILENAME"

upload-sensitive-files: plays/sensitive_files.yml
	ansible-playbook plays/sensitive_files.yml --extra-vars "sensitive_files_action=upload"

download-sensitive-files: plays/sensitive_files.yml
	ansible-playbook plays/sensitive_files.yml --extra-vars "sensitive_files_action=download"
