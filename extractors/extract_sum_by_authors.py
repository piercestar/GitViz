import sys,json,datetime,time,csv

output = open('sum_by_authors.csv', 'wb');
writer = csv.writer(output);

# git log query:
# git log --since='2016-01-01' --until='2016-01-31' --date=format:'%Y%m%d' --format=format:'%cd % an' | sort > intermediate.txt
with open("intermediate.txt", 'r') as dataFile :
	data = dataFile.readlines();

# Helper function to wrap the CSV writer to fill in missing days,
# handle starting 00th day and convert the full date to day only
allRows = [];
def pushToRowHelper(arr) : 
	if (arr[0] > 20160100 and arr[0] < 20160132) : 
		# Check the last date of the array and calculate the
		# difference to fill in the missing days
		lastStoredDay = 0;
		currDayInInt = int(str(arr[0])[6:8]);
		if (len(allRows) != 0) : 
			lastStoredDay = allRows[len(allRows) - 1][0];

		diff = currDayInInt - lastStoredDay;
		for i in range (1, diff) :
			allRows.append([lastStoredDay + i, 0, 0]);
		# Push the actual array after filling in missing days
		allRows.append([currDayInInt, arr[1], arr[2]]); 

# Write all rows to CSV file
def writeAllToCSV():
	writer.writerow(('day', 'A-M', 'N-Z'));
	for i, row in enumerate(allRows):
		writer.writerow(row);
	# Handle writing leftover days
	lastStoredDay = len(allRows);
	for i in range (lastStoredDay + 1, 32) : 
		writer.writerow([i, 0, 0]);

# Main processing block
prevDateInt = 20160100;
amCount = nzCount = 0;

for i, row in enumerate(data) :

	dateInt = int(row[:8]);

	# Restrict the date to only January 2016
	if (dateInt > 20160100 and dateInt < 20160132) :

		# Process first before writing if on the last line
		if (i == len(data) - 1) :
			# Reset the counts if previous line had a different
			# date
			if (dateInt != prevDateInt) :
				amCount = nzCount = 0;

			firstLetterOfName = row[10:11];
			if (firstLetterOfName.lower() <= 'm') :
				amCount += 1;
			else :
				nzCount += 1;

			# If previous line was different write as a new line,
			# otherwise write using the previous line's date
			if (dateInt != prevDateInt) : 
				pushToRowHelper([dateInt, amCount, nzCount]);
			else :
				pushToRowHelper([prevDateInt, amCount, nzCount]);

		else : 
			# Process afterwards if there are still lines remaining
			if (dateInt != prevDateInt) :
				pushToRowHelper([prevDateInt, amCount, nzCount]);
				# Reset variables
				amCount = nzCount = 0;

			# Continue processing
			firstLetterOfName = row[10:11];
			if (firstLetterOfName.lower() <= 'm') :
				amCount += 1;
			else :
				nzCount += 1;

		# Update the previous date once the processing for the current
		# line is completed	
		prevDateInt = dateInt;

writeAllToCSV();

