publish-%: $@
	@FILENAME="$(@:publish-%=%)"; \
	ansible-playbook plays/npm_publish.yml --extra-vars "package_name=$$FILENAME"
