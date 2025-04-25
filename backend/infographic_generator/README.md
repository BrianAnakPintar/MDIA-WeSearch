# This is a very rough script for the infographic generator.

How to use:
1. Enter the OpenAI API key in the `config.py` file.
2. Install the required dependencies by running `pip install -r requirements.txt`.
3. If you are using a virtual environment, activate it before running the script.
4. Run the script using
```bash
python main.py <pdf_path> \
  --title   <Paper Title Goes Here> \
  --authors <Authors goes here> \
  --abstract <Abstract goes here> \
  [--output infographic.png] \
  [--no-images]
```

Example of the script:
```bash
python main.py ImageNet.pdf \
  --title   "ImageNet" \
  --authors "Feifei" \
  --abstract "Here is the abstract text of the paper..."
```
